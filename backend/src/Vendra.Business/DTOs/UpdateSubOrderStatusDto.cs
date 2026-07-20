using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class UpdateSubOrderStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
