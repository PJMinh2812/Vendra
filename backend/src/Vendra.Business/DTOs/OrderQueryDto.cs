using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class OrderQueryDto
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
}
