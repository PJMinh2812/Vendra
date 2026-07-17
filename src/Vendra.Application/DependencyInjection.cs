using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Vendra.Application;

//Lớp tỉnh chứa extension method để Program.cs gọi gọn: builder.Services.AddApplication();

public static class DependencyInjection{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        //Quét toàn bộ assembly Application, tự đăng ký mọi Handler (PingQueryHandler...)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        return services;
    }
}
