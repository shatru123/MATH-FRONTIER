using MathFrontier.Core.Entities;
using MathFrontier.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperimentsController : ControllerBase
{
    private readonly MathFrontierDbContext _context;

    public ExperimentsController(MathFrontierDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Experiment>>> GetExperiments()
    {
        var experiments = await _context.Experiments.ToListAsync();
        return Ok(experiments);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Experiment>> GetExperimentBySlug(string slug)
    {
        var experiment = await _context.Experiments.FirstOrDefaultAsync(e => e.Slug == slug);
        if (experiment == null)
        {
            return NotFound(new { message = $"Experiment with slug '{slug}' not found." });
        }
        return Ok(experiment);
    }
}
