using Vendra.Business;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký MVC Controllers (thay vì Minimal API) — khớp với cách slide/course dạy: [ApiController] + [Route]
builder.Services.AddControllers();

// Bật Swagger để test API bằng giao diện web (không cần Postman)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký toàn bộ dịch vụ tầng Business (Service + interface của nó)
builder.Services.AddBusiness();

var app = builder.Build();

// Chỉ bật Swagger ở môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Kích hoạt routing tới các action trong Controllers (PingController, sau này ProductController...)
app.MapControllers();

app.Run();