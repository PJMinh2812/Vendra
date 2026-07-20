using System.ComponentModel.DataAnnotations;

namespace Vendra.Business.DTOs;
public class ProductQueryDto
{
    public string? Search {get; set; }
    public int? CategoryId {get; set; }
    public int? ShopId {get; set; }
    public bool Random {get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MinPrice{get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MaxPrice {get; set; }

    [Range(1, int.MaxValue)]
    public int Page {get; set; } = 1;
    
    [Range(1, 100)]
    public int PageSize {get; set; } = 10;
}
