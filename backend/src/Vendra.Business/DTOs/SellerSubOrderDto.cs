namespace Vendra.Business.DTOs;

public class SellerSubOrderDto
{
    public int OrderId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}
