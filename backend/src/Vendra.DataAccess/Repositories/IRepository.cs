using System.Linq.Expressions;

namespace Vendra.DataAccess.Repositories;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, params Expression<Func<T, object>>[] includes);
    Task<List<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);
    IQueryable<T> Query();
    Task AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
}