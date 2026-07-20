using AutoMapper;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Models;

namespace Vendra.Business.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Convention tự flatten: CategoryName<-Category.Name, ShopName<-Shop.Name
        // AverageRating/ReviewCount/SoldCount tính trực tiếp trên navigation Reviews/OrderItems —
        // ProjectTo dịch thành subquery SQL (AVG/COUNT/SUM), không cần Include thủ công.
        // SoldCount tính tất cả OrderItem trừ SubOrder đã Cancelled (khác điều kiện "Delivered"
        // của review — "đã bán" phản ánh giao dịch thật đã xảy ra, không cần chờ giao xong).
        CreateMap<Product, ProductDto>()
            .ForMember(d => d.AverageRating, o => o.MapFrom(s => s.Reviews.Any() ? s.Reviews.Average(r => r.Rating) : 0))
            .ForMember(d => d.ReviewCount, o => o.MapFrom(s => s.Reviews.Count))
            .ForMember(d => d.SoldCount, o => o.MapFrom(s => s.OrderItems.Where(oi => oi.SubOrder.Status != "Cancelled").Sum(oi => oi.Quantity)));
        CreateMap<Shop, ShopDto>();
        CreateMap<Category, CategoryDto>();
        CreateMap<Review, ReviewDto>();

        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.LineTotal, o => o.MapFrom(s => s.UnitPrice * s.Quantity));

        // ShopName tự flatten; Items<-OrderItems phải chỉ định vì khác tên
        CreateMap<SubOrder, SubOrderDto>()
            .ForMember(d => d.Items, o => o.MapFrom(s => s.OrderItems));

        CreateMap<SubOrder, SellerSubOrderDto>()
            .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.Order.CreatedAt))
            .ForMember(d => d.Items, o => o.MapFrom(s => s.OrderItems));

        CreateMap<Order, OrderDto>()
            .ForMember(d => d.PaymentMethod, o => o.MapFrom(s => s.Payment != null ? s.Payment.Method : string.Empty))
            .ForMember(d => d.PaymentStatus, o => o.MapFrom(s => s.Payment != null ? s.Payment.Status : string.Empty));
        // PayUrl không map từ entity — CheckoutAsync tự gán sau khi tạo link MoMo.
    }
}
