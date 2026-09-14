using MathFrontier.Core.Enums;

namespace MathFrontier.Core.Entities;

public class Problem
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public ProblemStatus Status { get; set; }
    public DifficultyLevel Difficulty { get; set; }
    public int? YearIntroduced { get; set; }
    public string LastVerified { get; set; } = string.Empty;
    public string StatusSource { get; set; } = string.Empty;
    public string SourceType { get; set; } = string.Empty;
    public string StatusNotes { get; set; } = string.Empty;
    public string MathematicalStatement { get; set; } = string.Empty;
    public string Intuition { get; set; } = string.Empty;
    public string WhyItMatters { get; set; } = string.Empty;
    public List<string> WhatWeKnow { get; set; } = new();
    public List<string> WhatWeDontKnow { get; set; } = new();
    public List<string> PartialResults { get; set; } = new();
    public List<string> CommonMisconceptions { get; set; } = new();
    public string History { get; set; } = string.Empty;
    public string? VisualizationSlug { get; set; }
    public bool HasExperiment { get; set; }
    public string? ExperimentSlug { get; set; }
    public List<string> RelatedProblems { get; set; } = new();
    public List<int> SourceIds { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public List<string> ClaimedSolutions { get; set; } = new();
    public List<string> HistoricalStatuses { get; set; } = new();
}
