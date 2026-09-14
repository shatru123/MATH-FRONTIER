using MathFrontier.Core.Enums;

namespace MathFrontier.Core.DTOs;

public class ProblemFilterDto
{
    public ProblemStatus? Status { get; set; }
    public string? Category { get; set; }
    public DifficultyLevel? Difficulty { get; set; }
    public string? Field { get; set; }
    public bool? HasVisualization { get; set; }
    public bool? HasExperiment { get; set; }
}

public class SearchResultDto
{
    public string Type { get; set; } = string.Empty; // "Problem", "Wonder", "Mathematician", "Timeline"
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? Status { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class HealthResponseDto
{
    public string Status { get; set; } = "Healthy";
    public string Service { get; set; } = "MathFrontier.Api";
    public string Version { get; set; } = "1.0.0";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string DatabaseProvider { get; set; } = string.Empty;
    public bool DatabaseConnected { get; set; }
}
