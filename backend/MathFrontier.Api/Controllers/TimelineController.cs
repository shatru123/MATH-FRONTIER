using MathFrontier.Core.Entities;
using MathFrontier.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimelineController : ControllerBase
{
    private readonly ITimelineRepository _repository;

    public TimelineController(ITimelineRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimelineEvent>>> GetTimeline()
    {
        var events = await _repository.GetAllAsync();
        return Ok(events);
    }
}
