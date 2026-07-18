using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;

namespace Vendra.Business.Services;

public class ProductService : IProductService
{
    private readonly VendraDbContext _dbContext;
    
    public ProductService(VendraDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        return await _dbContext.Products.Include(p => p.Category).Include(p => p.Shop).Where(p => p.IsActive).Select(p => new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Stock = p.Stock,
            ImageUrl = p.ImageUrl,
            CategoryName = p.Category.Name,
            ShopName = p.Shop.Name
        }).ToListAsync();
    }
}