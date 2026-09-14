namespace MathFrontier.Core.Entities;

public class Experiment
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ProblemSlug { get; set; }
    public string? WonderSlug { get; set; }
    public string ConfigJson { get; set; } = "{}";
    public string Instructions { get; set; } = string.Empty;
}
