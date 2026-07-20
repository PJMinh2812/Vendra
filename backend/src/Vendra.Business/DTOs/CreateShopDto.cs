using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class CreateShopDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }
}
