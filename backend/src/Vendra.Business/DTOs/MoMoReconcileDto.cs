using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class MoMoReconcileDto
{
    [Required]
    public string OrderId { get; set; } = string.Empty;
}
