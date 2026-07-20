using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class CreateOrderDto
{
    [Required]
    [MaxLength(500)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required]
    public string PaymentMethod { get; set; } = string.Empty;
}
