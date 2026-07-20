using Microsoft.Extensions.DependencyInjection;
using Vendra.Business.Mapping;
using Vendra.Business.Services;

namespace Vendra.Business;

public static class DependencyInjection
{
    public static IServiceCollection AddBusiness(this IServiceCollection services)
    {
        services.AddMemoryCache();
        services.AddAutoMapper(typeof(MappingProfile).Assembly);
        services.AddScoped<IPingService, PingService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IShopService, ShopService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddHttpClient<IMoMoService, MoMoService>();

        return services;
    }
}
