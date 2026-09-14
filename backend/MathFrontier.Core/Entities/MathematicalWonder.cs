using MathFrontier.Core.Enums;

namespace MathFrontier.Core.Entities;

public class MathematicalWonder
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public ProblemStatus Status { get; set; } = ProblemStatus.PHENOMENON;
    public string Intuition { get; set; } = string.Empty;
    public string Mathematics { get; set; } = string.Empty;
    public List<string> Properties { get; set; } = new();
    public List<string> ConstructionSteps { get; set; } = new();
    public string ParametricEquations { get; set; } = string.Empty;
    public string? VisualizationSlug { get; set; }
    public bool HasExperiment { get; set; }
    public string? ExperimentSlug { get; set; }
    public List<string> Tags { get; set; } = new();
    public List<string> Sources { get; set; } = new();
}
