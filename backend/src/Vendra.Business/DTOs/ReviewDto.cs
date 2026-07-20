namespace Vendra.Business.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public string ReviewerName { get; set; } = null!;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
