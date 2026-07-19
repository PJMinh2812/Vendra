using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IProductService
{
    Task<PagedResultDto<ProductDto>> GetAllAsync(ProductQueryDto querys);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<bool> UpdateAsync(int id, UpdateProductDto dto);
    Task<bool> DeleteAsync(int id);
}