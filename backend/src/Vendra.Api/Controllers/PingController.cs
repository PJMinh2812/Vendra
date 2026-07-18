using Microsoft.AspNetCore.Mvc;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PingController : ControllerBase
{
    private readonly IPingService _pingService;

    public PingController(IPingService pingService)
    {
        _pingService = pingService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_pingService.Ping());
    }
}
