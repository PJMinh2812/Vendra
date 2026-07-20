using Vendra.DataAccess.Repositories;

namespace Vendra.DataAccess.UnitOfWork;

public interface IUnitOfWork
{
    IRepository<T> Repository<T>() where T : class;
    Task<int> SaveChangesAsync();
}