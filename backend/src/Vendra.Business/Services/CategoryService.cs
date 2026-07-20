using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _UnitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _UnitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _UnitOfWork.Repository<Category>().GetAllAsync();

        return _mapper.Map<List<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category { Name = dto.Name };
        await _UnitOfWork.Repository<Category>().AddAsync(category);
        await _UnitOfWork.SaveChangesAsync();

        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<bool> UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _UnitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category is null) return false;

        category.Name = dto.Name;
        _UnitOfWork.Repository<Category>().Update(category);
        await _UnitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _UnitOfWork.Repository<Category>().GetByIdAsync(id);
        if (category is null) return false;

        var hasProducts = await _UnitOfWork.Repository<Product>().Query()
            .AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
        {
            throw new InvalidOperationException("Không thể xóa danh mục đang có sản phẩm.");
        }

        _UnitOfWork.Repository<Category>().Remove(category);
        await _UnitOfWork.SaveChangesAsync();
        return true;
    }
}