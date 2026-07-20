using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.DTOs;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Customer")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(cart);
    }

    [HttpPost]
    public async Task<IActionResult> AddItem(AddCartItemDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var item = await _cartService.AddItemAsync(userId, dto);
        return Ok(item);
    }

    [HttpPut("{productId}")]
    public async Task<IActionResult> UpdateItem(int productId, UpdateCartItemDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _cartService.UpdateItemAsync(userId, productId, dto);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveItem(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _cartService.RemoveItemAsync(userId, productId);
        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
