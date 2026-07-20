namespace Vendra.Business.DTOs;

public class DashboardStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int OrdersToday { get; set; }
    public int PendingShops { get; set; }
    public int TotalProducts { get; set; }
    public int TotalUsers { get; set; }
    public List<DailyRevenueDto> RevenueLast7Days { get; set; } = new();
}

public class DailyRevenueDto
{
    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
}
