using MathFrontier.Core.Entities;
using MathFrontier.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SourcesController : ControllerBase
{
    private readonly MathFrontierDbContext _context;

    public SourcesController(MathFrontierDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Source>>> GetSources()
    {
        var sources = await _context.Sources.OrderBy(s => s.Year).ToListAsync();
        return Ok(sources);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Source>> GetSourceById(int id)
    {
        var source = await _context.Sources.FindAsync(id);
        if (source == null)
        {
            return NotFound(new { message = $"Source with ID '{id}' was not found." });
        }
        return Ok(source);
    }
}
