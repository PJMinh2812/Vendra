using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.DTOs;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Checkout(CreateOrderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var order = await _orderService.CheckoutAsync(userId, dto);
        return StatusCode(StatusCodes.Status201Created, order);
    }

    [HttpGet]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetMyOrders([FromQuery] OrderQueryDto query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _orderService.GetMyOrdersAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> GetMyOrderById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var order = await _orderService.GetOrderByIdForCustomerAsync(userId, id);
        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [HttpGet("shop")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetShopOrders([FromQuery] OrderQueryDto query)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _orderService.GetShopOrdersAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders([FromQuery] OrderQueryDto query)
    {
        var result = await _orderService.GetAllOrdersAsync(query);
        return Ok(result);
    }

    [HttpPut("{id:int}/shops/{shopId:int}/cancel")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CancelSubOrder(int id, int shopId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _orderService.CancelSubOrderAsync(userId, id, shopId);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateSubOrderStatusDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _orderService.UpdateSubOrderStatusAsync(userId, id, dto.Status);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
