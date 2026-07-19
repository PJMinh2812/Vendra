using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _UnitOfWork;

    public CategoryService(IUnitOfWork unitOfWork)
    {
        _UnitOfWork = unitOfWork;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _UnitOfWork.Repository<Category>().GetAllAsync();

        return categories.Select(c => new CategoryDto {Id = c.Id, Name = c.Name}).ToList();
    }
}