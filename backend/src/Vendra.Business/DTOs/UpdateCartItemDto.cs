using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class UpdateCartItemDto
{
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
