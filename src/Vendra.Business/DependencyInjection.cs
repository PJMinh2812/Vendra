using Microsoft.Extensions.DependencyInjection;
using Vendra.Business.Services;

namespace Vendra.Business;

// Lớp tĩnh chứa extension method để Program.cs gọi gọn: builder.Services.AddBusiness();
public static class DependencyInjection
{
    public static IServiceCollection AddBusiness(this IServiceCollection services)
    {
        services.AddScoped<IPingService, PingService>();

        return services;
    }
}
