using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class GoogleLoginDto
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
}
