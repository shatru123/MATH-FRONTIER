namespace MathFrontier.Core.Entities;

public class Mathematician
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int? BornYear { get; set; }
    public int? DiedYear { get; set; }
    public string Nationality { get; set; } = string.Empty;
    public string Biography { get; set; } = string.Empty;
    public List<string> KeyContributions { get; set; } = new();
    public string Era { get; set; } = string.Empty;
}
