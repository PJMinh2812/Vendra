using MediatR;
using Vendra.Application;
using Vendra.Application.Ping;

var builder = WebApplication.CreateBuilder(args);

// Bật Swagger để test API bằng giao diện web (không cần Postman)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký toàn bộ dịch vụ tầng Application (MediatR + các Handler)
builder.Services.AddApplication();

var app = builder.Build();

// Chỉ bật Swagger ở môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// /ping bây giờ đi qua CQRS: gửi PingQuery → MediatR tìm PingQueryHandler → trả "pong"
app.MapGet("/ping", async (IMediator mediator) =>
    await mediator.Send(new PingQuery()));

app.Run();