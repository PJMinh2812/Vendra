using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.DTOs;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ShopsController : ControllerBase
{
    private readonly IShopService _shopService;

    public ShopsController(IShopService shopService)
    {
        _shopService = shopService;
    }

    [HttpPost]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> Register(CreateShopDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        try
        {
            var result = await _shopService.RegisterAsync(userId, dto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Seller")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var shop = await _shopService.GetMineAsync(userId);
        if (shop is null) return NotFound();
        return Ok(shop);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var shops = await _shopService.GetAllAsync(status);
        return Ok(shops);
    }

    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int id)
    {
        var success = await _shopService.ApproveAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPut("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(int id)
    {
        var success = await _shopService.RejectAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
