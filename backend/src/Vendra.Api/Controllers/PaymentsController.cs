using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.DTOs;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IOrderService _orderService;

    public PaymentsController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("momo-ipn")]
    [AllowAnonymous]
    public async Task<IActionResult> MoMoIpn(MoMoIpnDto ipn)
    {
        var handled = await _orderService.HandleMoMoIpnAsync(ipn);
        return handled ? Ok() : BadRequest();
    }
}
