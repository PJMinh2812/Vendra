using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class CreateProductDto
{
    [Required]
    public int CategoryId {get; set;}

    [Required]
    [MaxLength(200)]
    public string Name {set; get;} = null;

    [MaxLength(2000)]
    public string? Description {get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price {get; set; }

    [Range(0, int.MaxValue)]
    public int Stock {get; set;}

    [MaxLength(500)]
    public string? ImageUrl {set; get;}
}