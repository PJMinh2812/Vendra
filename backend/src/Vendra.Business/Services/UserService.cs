using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Identity;

namespace Vendra.Business.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<List<AdminUserDto>> GetAllAsync()
    {
        var users = await _userManager.Users.ToListAsync();

        var result = new List<AdminUserDto>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FullName = user.FullName,
                Role = roles.FirstOrDefault() ?? string.Empty,
                LockedOut = await _userManager.IsLockedOutAsync(user)
            });
        }

        return result;
    }

    public async Task<bool> LockAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Contains("Admin"))
        {
            throw new InvalidOperationException("Không thể khóa tài khoản Admin.");
        }

        await _userManager.SetLockoutEnabledAsync(user, true);
        await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
        return true;
    }

    public async Task<bool> UnlockAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null) return false;

        await _userManager.SetLockoutEndDateAsync(user, null);
        return true;
    }
}
