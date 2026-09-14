using MathFrontier.Core.DTOs;
using MathFrontier.Core.Entities;
using MathFrontier.Core.Enums;
using MathFrontier.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProblemsController : ControllerBase
{
    private readonly IProblemRepository _repository;

    public ProblemsController(IProblemRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Problem>>> GetProblems(
        [FromQuery] ProblemStatus? status,
        [FromQuery] string? category,
        [FromQuery] DifficultyLevel? difficulty,
        [FromQuery] string? field,
        [FromQuery] bool? hasVisualization,
        [FromQuery] bool? hasExperiment)
    {
        var filter = new ProblemFilterDto
        {
            Status = status,
            Category = category,
            Difficulty = difficulty,
            Field = field,
            HasVisualization = hasVisualization,
            HasExperiment = hasExperiment
        };

        var problems = await _repository.GetProblemsAsync(filter);
        return Ok(problems);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Problem>> GetProblemBySlug(string slug)
    {
        var problem = await _repository.GetBySlugAsync(slug);
        if (problem == null)
        {
            return NotFound(new { message = $"Problem with slug '{slug}' was not found." });
        }
        return Ok(problem);
    }

    [HttpGet("{slug}/related")]
    public async Task<ActionResult<IEnumerable<Problem>>> GetRelatedProblems(string slug)
    {
        var related = await _repository.GetRelatedProblemsAsync(slug);
        return Ok(related);
    }
}
