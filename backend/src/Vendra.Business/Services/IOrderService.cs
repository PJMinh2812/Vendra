using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IOrderService
{
    Task<OrderDto> CheckoutAsync(string customerUserId, CreateOrderDto dto);
    Task<bool> HandleMoMoIpnAsync(MoMoIpnDto ipn);
    Task<PagedResultDto<OrderDto>> GetMyOrdersAsync(string customerUserId, OrderQueryDto query);
    Task<OrderDto?> GetOrderByIdForCustomerAsync(string customerUserId, int orderId);
    Task<PagedResultDto<SellerSubOrderDto>> GetShopOrdersAsync(string sellerUserId, OrderQueryDto query);
    Task<PagedResultDto<OrderDto>> GetAllOrdersAsync(OrderQueryDto query);
    Task<bool> CancelSubOrderAsync(string customerUserId, int orderId, int shopId);
    Task<bool> UpdateSubOrderStatusAsync(string sellerUserId, int orderId, string newStatus);
}
