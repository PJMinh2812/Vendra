using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class ShopService : IShopService
{
    private readonly IUnitOfWork _unitOfWork;

    public ShopService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ShopDto> RegisterAsync(string ownerUserId, CreateShopDto dto)
    {
        var existing = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.OwnerUserId == ownerUserId);

        if (existing is not null)
        {
            throw new InvalidOperationException("Bạn đã đăng ký shop rồi.");
        }

        var shop = new Shop
        {
            OwnerUserId = ownerUserId,
            Name = dto.Name,
            Description = dto.Description,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Shop>().AddAsync(shop);
        await _unitOfWork.SaveChangesAsync();

        return ToDto(shop);
    }

    public async Task<ShopDto?> GetMineAsync(string ownerUserId)
    {
        var shop = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.OwnerUserId == ownerUserId);

        return shop is null ? null : ToDto(shop);
    }

    public async Task<ShopDto?> GetByIdAsync(int id)
    {
        var shop = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.Id == id && s.Status == "Approved");

        return shop is null ? null : ToDto(shop);
    }

    public async Task<List<ShopDto>> GetAllAsync(string? status)
    {
        var query = _unitOfWork.Repository<Shop>().Query();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(s => s.Status == status);
        }

        var shops = await query.ToListAsync();
        return shops.Select(ToDto).ToList();
    }

    public async Task<bool> ApproveAsync(int shopId)
    {
        var shop = await _unitOfWork.Repository<Shop>().GetByIdAsync(shopId);
        if (shop is null) return false;

        shop.Status = "Approved";
        _unitOfWork.Repository<Shop>().Update(shop);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RejectAsync(int shopId)
    {
        var shop = await _unitOfWork.Repository<Shop>().GetByIdAsync(shopId);
        if (shop is null) return false;

        shop.Status = "Rejected";
        _unitOfWork.Repository<Shop>().Update(shop);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private static ShopDto ToDto(Shop shop)
    {
        return new ShopDto
        {
            Id = shop.Id,
            OwnerUserId = shop.OwnerUserId,
            Name = shop.Name,
            Description = shop.Description,
            Status = shop.Status,
            CreatedAt = shop.CreatedAt
        };
    }
}
