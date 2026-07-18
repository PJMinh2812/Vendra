using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Vendra.DataAccess.Models;

namespace Vendra.DataAccess;

public static class DependencyInjection
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<VendraDbContext>(options => options.UseSqlServer(connectionString));

        return services;
    }
}