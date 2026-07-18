using Vendra.DataAccess.Models;
using Vendra.DataAccess.Repositories;

namespace Vendra.DataAccess.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly VendraDbContext _dbContext;
    private readonly Dictionary<Type, object> _repository = new();

    public UnitOfWork(VendraDbContext dbContext)
    {
        _dbContext = dbContext;
    }   

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);

        if (!_repository.ContainsKey(type))
        {
            _repository[type] = new Repository<T>(_dbContext);
        }
        return (IRepository<T>)_repository[type];
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _dbContext.SaveChangesAsync();
    }
}