using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;

public class CreateReviewDto
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(1000)]
    public string? Comment { get; set; }
}
