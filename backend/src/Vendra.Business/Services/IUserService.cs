using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IUserService
{
    Task<List<AdminUserDto>> GetAllAsync();
    Task<bool> LockAsync(string userId);
    Task<bool> UnlockAsync(string userId);
}
