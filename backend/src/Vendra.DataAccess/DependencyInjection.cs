using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Vendra.DataAccess.Identity;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.DataAccess;

public static class DependencyInjection
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<VendraDbContext>(options => options.UseSqlServer(connectionString));
        services.AddScoped<IUnitOfWork, Vendra.DataAccess.UnitOfWork.UnitOfWork>();

        services.AddDbContext<AppIdentityDbContext>(options => options.UseSqlServer(connectionString));
        services.AddIdentityCore<ApplicationUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppIdentityDbContext>();



        return services;
    }
}
