var builder = WebApplication.CreateBuilder(args);

// Bật Swagger để test API bằng giao diện web (không cần Postman)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Chỉ bật Swagger ở môi trường Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Endpoint kiểm tra sức khỏe: gọi GET /ping -> trả "pong"
app.MapGet("/ping", () => "pong");

app.Run();
