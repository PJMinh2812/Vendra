using MediatR;

namespace Vendra.Application.Ping;

// Query = yêu cầu CHỈ ĐỌC. IRequest<string> nghĩa là "gửi cái này đi, nhận về string".
public record PingQuery : IRequest<string>;