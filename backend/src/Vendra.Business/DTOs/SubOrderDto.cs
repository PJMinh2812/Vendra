namespace Vendra.Business.DTOs;

public class SubOrderDto
{
    public int ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
