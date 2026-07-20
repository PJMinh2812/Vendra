using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vendra.Business.Services;

namespace Vendra.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    [HttpPut("{id}/lock")]
    public async Task<IActionResult> Lock(string id)
    {
        var success = await _userService.LockAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPut("{id}/unlock")]
    public async Task<IActionResult> Unlock(string id)
    {
        var success = await _userService.UnlockAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
