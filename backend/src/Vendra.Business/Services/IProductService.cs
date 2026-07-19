using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IProductService
{
    Task<PagedResultDto<ProductDto>> GetAllAsync(ProductQueryDto querys);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(string ownerUserId, CreateProductDto dto);
    Task<ProductActionResult> UpdateAsync(string ownerUserId, int id, UpdateProductDto dto);
    Task<ProductActionResult> DeleteAsync(string ownerUserId, int id);
}
