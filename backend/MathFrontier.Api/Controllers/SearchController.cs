using MathFrontier.Core.DTOs;
using MathFrontier.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SearchResultDto>>> Search([FromQuery] string? q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return Ok(Enumerable.Empty<SearchResultDto>());
        }

        var results = await _searchService.SearchAsync(q);
        return Ok(results);
    }
}
