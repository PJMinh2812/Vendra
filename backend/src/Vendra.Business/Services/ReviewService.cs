using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Identity;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReviewService(IUnitOfWork unitOfWork, IMapper mapper, UserManager<ApplicationUser> userManager)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<List<ReviewDto>> GetByProductIdAsync(int productId)
    {
        var reviews = await _unitOfWork.Repository<Review>().Query()
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<ReviewDto>>(reviews);
    }

    public async Task<bool> CanReviewAsync(string userId, int productId)
    {
        if (!await HasDeliveredPurchaseAsync(userId, productId))
        {
            return false;
        }

        var alreadyReviewed = await _unitOfWork.Repository<Review>().Query()
            .AnyAsync(r => r.ProductId == productId && r.UserId == userId);

        return !alreadyReviewed;
    }

    public async Task<ReviewDto> CreateAsync(string userId, int productId, CreateReviewDto dto)
    {
        if (!await HasDeliveredPurchaseAsync(userId, productId))
        {
            throw new InvalidOperationException("Bạn chỉ có thể đánh giá sản phẩm đã mua và nhận hàng.");
        }

        var alreadyReviewed = await _unitOfWork.Repository<Review>().Query()
            .AnyAsync(r => r.ProductId == productId && r.UserId == userId);

        if (alreadyReviewed)
        {
            throw new InvalidOperationException("Bạn đã đánh giá sản phẩm này rồi.");
        }

        var user = await _userManager.FindByIdAsync(userId);

        var review = new Review
        {
            ProductId = productId,
            UserId = userId,
            ReviewerName = user?.FullName ?? "Khách hàng",
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Review>().AddAsync(review);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ReviewDto>(review);
    }

    // Verified purchase: chỉ khách có OrderItem của sản phẩm này ở SubOrder đã "Delivered".
    private async Task<bool> HasDeliveredPurchaseAsync(string userId, int productId)
    {
        return await _unitOfWork.Repository<OrderItem>().Query()
            .AnyAsync(oi => oi.ProductId == productId
                && oi.SubOrder.Status == "Delivered"
                && oi.SubOrder.Order.CustomerUserId == userId);
    }
}
