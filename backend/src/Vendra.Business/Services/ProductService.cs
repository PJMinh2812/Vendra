using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query)
    {
        var productsQuery = _unitOfWork.Repository<Product>().Query()
            .Include(p => p.Category)
            .Include(p => p.Shop)
            .Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            productsQuery = productsQuery.Where(p => p.Name.Contains(query.Search));
        }

        if (query.CategoryId.HasValue)
        {
            productsQuery = productsQuery.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        if (query.MinPrice.HasValue)
        {
            productsQuery = productsQuery.Where(p => p.Price >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            productsQuery = productsQuery.Where(p => p.Price <= query.MaxPrice.Value);
        }

        var totalCount = await productsQuery.CountAsync();

        var items = await productsQuery
            .OrderBy(p => p.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryName = p.Category.Name,
                ShopName = p.Shop.Name
            })
            .ToListAsync();

        return new PagedResultDto<ProductDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _unitOfWork.Repository<Product>()
            .GetByIdAsync(id, p => p.Category, p => p.Shop);

        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(string ownerUserId, CreateProductDto dto)
    {
        var shop = await GetOwnedShopAsync(ownerUserId);

        if (shop.Status != "Approved")
        {
            throw new InvalidOperationException("Shop chưa được duyệt, chưa thể đăng sản phẩm.");
        }

        var product = new Product
        {
            ShopId = shop.Id,
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            IsActive = true
        };

        await _unitOfWork.Repository<Product>().AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.Repository<Product>()
            .GetByIdAsync(product.Id, p => p.Category, p => p.Shop);

        return MapToDto(created!);
    }

    public async Task<ProductActionResult> UpdateAsync(string ownerUserId, int id, UpdateProductDto dto)
    {
        var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product is null)
        {
            return ProductActionResult.NotFound;
        }

        var shop = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.OwnerUserId == ownerUserId);

        if (shop is null || product.ShopId != shop.Id)
        {
            return ProductActionResult.Forbidden;
        }

        product.CategoryId = dto.CategoryId;
        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.ImageUrl = dto.ImageUrl;

        _unitOfWork.Repository<Product>().Update(product);
        await _unitOfWork.SaveChangesAsync();

        return ProductActionResult.Success;
    }

    public async Task<ProductActionResult> DeleteAsync(string ownerUserId, int id)
    {
        var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product is null)
        {
            return ProductActionResult.NotFound;
        }

        var shop = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.OwnerUserId == ownerUserId);

        if (shop is null || product.ShopId != shop.Id)
        {
            return ProductActionResult.Forbidden;
        }

        product.IsActive = false;
        _unitOfWork.Repository<Product>().Update(product);
        await _unitOfWork.SaveChangesAsync();

        return ProductActionResult.Success;
    }

    private async Task<Shop> GetOwnedShopAsync(string ownerUserId)
    {
        var shop = await _unitOfWork.Repository<Shop>().Query()
            .FirstOrDefaultAsync(s => s.OwnerUserId == ownerUserId);

        if (shop is null)
        {
            throw new InvalidOperationException("Bạn chưa có shop, hãy đăng ký shop trước.");
        }

        return shop;
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        Stock = p.Stock,
        ImageUrl = p.ImageUrl,
        CategoryName = p.Category.Name,
        ShopName = p.Shop.Name
    };
}
