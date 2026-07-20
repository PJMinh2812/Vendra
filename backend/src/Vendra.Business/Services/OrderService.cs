using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMoMoService _moMoService;

    public OrderService(IUnitOfWork unitOfWork, IMoMoService moMoService)
    {
        _unitOfWork = unitOfWork;
        _moMoService = moMoService;
    }

    public async Task<OrderDto> CheckoutAsync(string customerUserId, CreateOrderDto dto)
    {
        if (dto.PaymentMethod != "COD" && dto.PaymentMethod != "MoMo")
        {
            throw new InvalidOperationException("Phương thức thanh toán không hợp lệ.");
        }

        var cartItems = await _unitOfWork.Repository<CartItem>().Query()
            .Include(c => c.Product)
            .Where(c => c.UserId == customerUserId)
            .ToListAsync();

        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Giỏ hàng đang trống.");
        }

        foreach (var item in cartItems)
        {
            if (!item.Product.IsActive)
            {
                throw new InvalidOperationException($"Sản phẩm '{item.Product.Name}' không còn được bán.");
            }

            if (item.Quantity > item.Product.Stock)
            {
                throw new InvalidOperationException($"Sản phẩm '{item.Product.Name}' không đủ tồn kho, chỉ còn {item.Product.Stock}.");
            }
        }

        var order = new Order
        {
            CustomerUserId = customerUserId,
            ShippingAddress = dto.ShippingAddress,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = cartItems.Sum(c => c.Product.Price * c.Quantity)
        };
        await _unitOfWork.Repository<Order>().AddAsync(order);

        var groupsByShop = cartItems.GroupBy(c => c.Product.ShopId);

        foreach (var group in groupsByShop)
        {
            var subOrder = new SubOrder
            {
                Order = order,
                ShopId = group.Key,
                Status = "Pending",
                Subtotal = group.Sum(c => c.Product.Price * c.Quantity)
            };
            await _unitOfWork.Repository<SubOrder>().AddAsync(subOrder);

            foreach (var item in group)
            {
                var orderItem = new OrderItem
                {
                    SubOrder = subOrder,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    UnitPrice = item.Product.Price,
                    Quantity = item.Quantity
                };
                await _unitOfWork.Repository<OrderItem>().AddAsync(orderItem);

                item.Product.Stock -= item.Quantity;
                _unitOfWork.Repository<Product>().Update(item.Product);
            }
        }

        foreach (var item in cartItems)
        {
            _unitOfWork.Repository<CartItem>().Remove(item);
        }

        var momoOrderId = dto.PaymentMethod == "MoMo" ? Guid.NewGuid().ToString() : null;

        var payment = new Payment
        {
            Order = order,
            Method = dto.PaymentMethod,
            Amount = order.TotalAmount,
            CreatedAt = DateTime.UtcNow,
            Status = dto.PaymentMethod == "COD" ? "Paid" : "Pending",
            PaidAt = dto.PaymentMethod == "COD" ? DateTime.UtcNow : null,
            TransactionId = momoOrderId
        };
        await _unitOfWork.Repository<Payment>().AddAsync(payment);

        await _unitOfWork.SaveChangesAsync();

        string? payUrl = null;

        if (dto.PaymentMethod == "MoMo")
        {
            try
            {
                payUrl = await _moMoService.CreatePaymentAsync(
                    momoOrderId!,
                    (long)order.TotalAmount,
                    $"Thanh toan don hang Vendra #{order.Id}");
            }
            catch (Exception ex) when (ex is not InvalidOperationException)
            {
                throw new InvalidOperationException(
                    $"Đơn hàng #{order.Id} đã tạo nhưng không tạo được liên kết thanh toán MoMo: {ex.Message}");
            }
        }

        var result = await BuildOrderDtoAsync(order.Id);
        result.PayUrl = payUrl;
        return result;
    }

    public async Task<bool> HandleMoMoIpnAsync(MoMoIpnDto ipn)
    {
        if (!_moMoService.VerifyIpnSignature(ipn))
        {
            return false;
        }

        var payment = await _unitOfWork.Repository<Payment>().Query()
            .FirstOrDefaultAsync(p => p.TransactionId == ipn.OrderId);

        if (payment is null)
        {
            return false;
        }

        if (ipn.ResultCode == 0)
        {
            payment.Status = "Paid";
            payment.PaidAt = DateTime.UtcNow;
            payment.TransactionId = ipn.TransId;
        }
        else
        {
            payment.Status = "Failed";
        }

        _unitOfWork.Repository<Payment>().Update(payment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private async Task<OrderDto> BuildOrderDtoAsync(int orderId)
    {
        var order = await _unitOfWork.Repository<Order>().Query()
            .Include(o => o.Payment)
            .Include(o => o.SubOrders).ThenInclude(so => so.Shop)
            .Include(o => o.SubOrders).ThenInclude(so => so.OrderItems)
            .FirstAsync(o => o.Id == orderId);

        return new OrderDto
        {
            Id = order.Id,
            TotalAmount = order.TotalAmount,
            ShippingAddress = order.ShippingAddress,
            CreatedAt = order.CreatedAt,
            PaymentMethod = order.Payment?.Method ?? string.Empty,
            PaymentStatus = order.Payment?.Status ?? string.Empty,
            SubOrders = order.SubOrders.Select(so => new SubOrderDto
            {
                ShopId = so.ShopId,
                ShopName = so.Shop.Name,
                Status = so.Status,
                Subtotal = so.Subtotal,
                Items = so.OrderItems.Select(oi => new OrderItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    UnitPrice = oi.UnitPrice,
                    Quantity = oi.Quantity,
                    LineTotal = oi.UnitPrice * oi.Quantity
                }).ToList()
            }).ToList()
        };
    }
}
