namespace MathFrontier.Core.Entities;

public class Category
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }

    public ICollection<Problem> Problems { get; set; } = new List<Problem>();
    public ICollection<MathematicalWonder> Wonders { get; set; } = new List<MathematicalWonder>();
}
