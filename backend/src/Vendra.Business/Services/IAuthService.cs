using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IAuthService
{
    Task<AuthResultDto> RegisterAsync(RegisterDto dto);
    Task<AuthResultDto> LoginAsync(LoginDto dto);
    Task<AuthResultDto> RefreshAsync(RefreshRequestDto dto);
    Task RevokeAsync(RefreshRequestDto dto);
    Task<AuthResultDto> GoogleLoginAsync(GoogleLoginDto dto);
}
