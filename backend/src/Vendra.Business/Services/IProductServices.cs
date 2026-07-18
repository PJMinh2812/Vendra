using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
}