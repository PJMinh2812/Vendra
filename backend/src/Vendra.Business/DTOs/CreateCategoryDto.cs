using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class CreateCategoryDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
}
