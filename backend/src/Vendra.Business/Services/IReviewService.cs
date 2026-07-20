using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IReviewService
{
    Task<List<ReviewDto>> GetByProductIdAsync(int productId);
    Task<bool> CanReviewAsync(string userId, int productId);
    Task<ReviewDto> CreateAsync(string userId, int productId, CreateReviewDto dto);
}
