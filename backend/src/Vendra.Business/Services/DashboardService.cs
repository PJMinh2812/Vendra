using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vendra.Business.DTOs;
using Vendra.DataAccess.Identity;
using Vendra.DataAccess.Models;
using Vendra.DataAccess.UnitOfWork;

namespace Vendra.Business.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;

    public DashboardService(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var sevenDaysAgo = today.AddDays(-6);

        var totalRevenue = await _unitOfWork.Repository<Payment>().Query()
            .Where(p => p.Status == "Paid")
            .SumAsync(p => (decimal?)p.Amount) ?? 0;

        var totalOrders = await _unitOfWork.Repository<Order>().Query().CountAsync();

        var ordersToday = await _unitOfWork.Repository<Order>().Query()
            .CountAsync(o => o.CreatedAt >= today);

        var pendingShops = await _unitOfWork.Repository<Shop>().Query()
            .CountAsync(s => s.Status == "Pending");

        var totalProducts = await _unitOfWork.Repository<Product>().Query()
            .CountAsync(p => p.IsActive);

        var totalUsers = await _userManager.Users.CountAsync();

        // Group trong bộ nhớ thay vì GROUP BY theo ngày trên SQL Server — dữ liệu 7 ngày nhỏ,
        // tránh vấn đề dịch DateOnly/DateTime.Date sang SQL của EF Core.
        var recentPayments = await _unitOfWork.Repository<Payment>().Query()
            .Where(p => p.Status == "Paid" && p.PaidAt != null && p.PaidAt >= sevenDaysAgo)
            .Select(p => new { p.PaidAt, p.Amount })
            .ToListAsync();

        var byDay = recentPayments
            .GroupBy(p => DateOnly.FromDateTime(p.PaidAt!.Value.Date))
            .ToDictionary(g => g.Key, g => g.Sum(p => p.Amount));

        var revenueLast7Days = Enumerable.Range(0, 7)
            .Select(i => DateOnly.FromDateTime(today.AddDays(-6 + i)))
            .Select(d => new DailyRevenueDto { Date = d, Amount = byDay.GetValueOrDefault(d) })
            .ToList();

        return new DashboardStatsDto
        {
            TotalRevenue = totalRevenue,
            TotalOrders = totalOrders,
            OrdersToday = ordersToday,
            PendingShops = pendingShops,
            TotalProducts = totalProducts,
            TotalUsers = totalUsers,
            RevenueLast7Days = revenueLast7Days
        };
    }
}
