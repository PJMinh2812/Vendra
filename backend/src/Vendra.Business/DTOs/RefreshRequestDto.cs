using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class RefreshRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
