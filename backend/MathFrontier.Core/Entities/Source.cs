namespace MathFrontier.Core.Entities;

public class Source
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Authors { get; set; } = string.Empty;
    public int? Year { get; set; }
    public string Publication { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string SourceType { get; set; } = string.Empty; // Journal, Book, Preprint, Clay Institute, etc.
    public bool IsPeerReviewed { get; set; } = true;
    public string CitationKey { get; set; } = string.Empty;
}
