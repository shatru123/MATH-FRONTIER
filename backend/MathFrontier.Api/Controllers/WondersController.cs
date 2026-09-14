using MathFrontier.Core.Entities;
using MathFrontier.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WondersController : ControllerBase
{
    private readonly IWonderRepository _repository;

    public WondersController(IWonderRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MathematicalWonder>>> GetWonders()
    {
        var wonders = await _repository.GetAllAsync();
        return Ok(wonders);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<MathematicalWonder>> GetWonderBySlug(string slug)
    {
        var wonder = await _repository.GetBySlugAsync(slug);
        if (wonder == null)
        {
            return NotFound(new { message = $"Mathematical wonder with slug '{slug}' was not found." });
        }
        return Ok(wonder);
    }
}
