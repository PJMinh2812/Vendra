using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Vendra.Business.DTOs;
using Vendra.Business.Settings;
using Vendra.DataAccess.Identity;

namespace Vendra.Business.Services;

public class AuthService : IAuthService
{
    private static readonly string[] AllowedRegisterRoles = { "Customer", "Seller" };

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly AppIdentityDbContext _identityDbContext;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        AppIdentityDbContext identityDbContext,
        IOptions<JwtSettings> jwtSettings)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _identityDbContext = identityDbContext;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
    {
        if (!AllowedRegisterRoles.Contains(dto.Role))
        {
            throw new InvalidOperationException($"Role phải là {string.Join(" hoặc ", AllowedRegisterRoles)}.");
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException(errors);
        }

        await _userManager.AddToRoleAsync(user, dto.Role);

        return await GenerateAuthResultAsync(user);
    }

    public async Task<AuthResultDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null)
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng.");
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng.");
        }

        if (await _userManager.IsLockedOutAsync(user))
        {
            throw new UnauthorizedAccessException("Tài khoản đã bị khóa.");
        }

        return await GenerateAuthResultAsync(user);
    }

    public async Task<AuthResultDto> RefreshAsync(RefreshRequestDto dto)
    {
        var storedToken = await _identityDbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == dto.RefreshToken);

        if (storedToken is null || storedToken.Revoked || storedToken.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn.");
        }

        storedToken.Revoked = true;

        var user = await _userManager.FindByIdAsync(storedToken.UserId);
        if (user is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại.");
        }

        return await GenerateAuthResultAsync(user);
    }

    public async Task RevokeAsync(RefreshRequestDto dto)
    {
        var storedToken = await _identityDbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == dto.RefreshToken);

        if (storedToken is not null)
        {
            storedToken.Revoked = true;
            await _identityDbContext.SaveChangesAsync();
        }
    }

    private async Task<AuthResultDto> GenerateAuthResultAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _tokenService.GenerateAccessToken(user, roles);
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays),
            CreatedAt = DateTime.UtcNow,
            Revoked = false,
        };

        _identityDbContext.RefreshTokens.Add(refreshToken);
        await _identityDbContext.SaveChangesAsync();

        return new AuthResultDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpiryMinutes),
        };
    }
}
