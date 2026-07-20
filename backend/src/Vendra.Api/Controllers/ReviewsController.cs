using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.DTOs;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/products/{productId:int}/reviews")]
[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var reviews = await _reviewService.GetByProductIdAsync(productId);
        return Ok(reviews);
    }

    [HttpGet("can-review")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> CanReview(int productId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var canReview = await _reviewService.CanReviewAsync(userId, productId);
        return Ok(new { canReview });
    }

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Create(int productId, CreateReviewDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await _reviewService.CreateAsync(userId, productId, dto);
        return Ok(result);
    }
}
