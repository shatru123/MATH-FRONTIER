namespace MathFrontier.Core.Entities;

public class TimelineEvent
{
    public int Id { get; set; }
    public int Year { get; set; }
    public string DateDisplay { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Significance { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? RelatedProblemSlug { get; set; }
    public string? RelatedWonderSlug { get; set; }
}
