using MathFrontier.Core.DTOs;
using MathFrontier.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly MathFrontierDbContext _context;
    private readonly IConfiguration _configuration;

    public HealthController(MathFrontierDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpGet]
    public IActionResult GetHealth()
    {
        var provider = _configuration["DATABASE_PROVIDER"] ?? "sqlite";
        return Ok(new HealthResponseDto
        {
            Status = "Healthy",
            Service = "MathFrontier.Api",
            Version = "1.0.0",
            Timestamp = DateTime.UtcNow,
            DatabaseProvider = provider,
            DatabaseConnected = true
        });
    }

    [HttpGet("db")]
    public async Task<IActionResult> GetDbHealth()
    {
        var provider = _configuration["DATABASE_PROVIDER"] ?? "sqlite";
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            var problemsCount = canConnect ? await _context.Problems.CountAsync() : 0;
            return Ok(new
            {
                Status = canConnect ? "Healthy" : "Unhealthy",
                DatabaseProvider = provider,
                CanConnect = canConnect,
                ProblemsCount = problemsCount,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Status = "Error",
                DatabaseProvider = provider,
                CanConnect = false,
                Error = ex.Message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
