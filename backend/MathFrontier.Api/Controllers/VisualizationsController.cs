using MathFrontier.Core.Entities;
using MathFrontier.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisualizationsController : ControllerBase
{
    private readonly IVisualizationRepository _repository;

    public VisualizationsController(IVisualizationRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Visualization>>> GetVisualizations()
    {
        var visualizations = await _repository.GetAllAsync();
        return Ok(visualizations);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Visualization>> GetVisualizationBySlug(string slug)
    {
        var viz = await _repository.GetBySlugAsync(slug);
        if (viz == null)
        {
            return NotFound(new { message = $"Visualization with slug '{slug}' was not found." });
        }
        return Ok(viz);
    }
}
