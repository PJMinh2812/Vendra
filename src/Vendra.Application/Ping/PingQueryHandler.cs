using MediatR;

namespace Vendra.Application.Ping;

// Handler xử lý PingQuery và trả về string. Đây là nơi chứa "logic".
public sealed class PingQueryHandler : IRequestHandler<PingQuery, string>
{
    public Task<string> Handle(PingQuery request, CancellationToken cancellationToken)
    {
        return Task.FromResult("pong");
    }
}