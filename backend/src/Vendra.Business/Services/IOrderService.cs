using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(string customerUserId, CreateOrderDto dto);
    Task<bool> HandleMoMoIpnAsync(MoMoIpnDto ipn);
}
