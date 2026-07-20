using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IShopService
{
    Task<ShopDto> RegisterAsync(string ownerUserId, CreateShopDto dto);
    Task<ShopDto?> GetMineAsync(string ownerUserId);
    Task<ShopDto?> GetByIdAsync(int id);
    Task<List<ShopDto>> GetAllAsync(string? status);
    Task<bool> ApproveAsync(int shopId);
    Task<bool> RejectAsync(int shopId);
}
