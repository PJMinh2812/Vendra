using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
}
