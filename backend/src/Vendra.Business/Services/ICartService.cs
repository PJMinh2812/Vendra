using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(string userId);
    Task<CartItemDto> AddItemAsync(string userId, AddCartItemDto dto);
    Task<bool> UpdateItemAsync(string userId, int productId, UpdateCartItemDto dto);
    Task<bool> RemoveItemAsync(string userId, int productId);
}
