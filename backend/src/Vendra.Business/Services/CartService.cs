using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class CartService : ICartService
{
    private readonly IUnitOfWork _unitOfWork;

    public CartService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CartDto> GetCartAsync(string userId)
    {
        var items = await _unitOfWork.Repository<CartItem>().Query()
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .Select(c => new CartItemDto
            {
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                Price = c.Product.Price,
                Quantity = c.Quantity,
                ImageUrl = c.Product.ImageUrl,
                LineTotal = c.Product.Price * c.Quantity
            })
            .ToListAsync();

        return new CartDto
        {
            Items = items,
            TotalAmount = items.Sum(i => i.LineTotal)
        };
    }

    public async Task<CartItemDto> AddItemAsync(string userId, AddCartItemDto dto)
    {
        var product = await _unitOfWork.Repository<Product>().GetByIdAsync(dto.ProductId);
        if (product is null || !product.IsActive)
        {
            throw new InvalidOperationException("Sản phẩm không tồn tại.");
        }

        var existing = await _unitOfWork.Repository<CartItem>().Query()
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == dto.ProductId);

        var newQuantity = (existing?.Quantity ?? 0) + dto.Quantity;

        if (newQuantity > product.Stock)
        {
            throw new InvalidOperationException($"Không đủ hàng tồn kho, chỉ còn {product.Stock} sản phẩm.");
        }

        if (existing is null)
        {
            existing = new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            };
            await _unitOfWork.Repository<CartItem>().AddAsync(existing);
        }
        else
        {
            existing.Quantity = newQuantity;
            _unitOfWork.Repository<CartItem>().Update(existing);
        }

        await _unitOfWork.SaveChangesAsync();

        return new CartItemDto
        {
            ProductId = product.Id,
            ProductName = product.Name,
            Price = product.Price,
            Quantity = existing.Quantity,
            ImageUrl = product.ImageUrl,
            LineTotal = product.Price * existing.Quantity
        };
    }

    public async Task<bool> UpdateItemAsync(string userId, int productId, UpdateCartItemDto dto)
    {
        var item = await _unitOfWork.Repository<CartItem>().Query()
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (item is null)
        {
            return false;
        }

        var product = await _unitOfWork.Repository<Product>().GetByIdAsync(productId);
        if (dto.Quantity > product!.Stock)
        {
            throw new InvalidOperationException($"Không đủ hàng tồn kho, chỉ còn {product.Stock} sản phẩm.");
        }

        item.Quantity = dto.Quantity;
        _unitOfWork.Repository<CartItem>().Update(item);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveItemAsync(string userId, int productId)
    {
        var item = await _unitOfWork.Repository<CartItem>().Query()
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (item is null)
        {
            return false;
        }

        _unitOfWork.Repository<CartItem>().Remove(item);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
