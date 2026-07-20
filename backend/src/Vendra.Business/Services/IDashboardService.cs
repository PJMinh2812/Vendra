using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}
