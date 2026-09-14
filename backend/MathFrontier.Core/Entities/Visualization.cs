using MathFrontier.Core.Enums;

namespace MathFrontier.Core.Entities;

public class Visualization
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public VisualizationType Type { get; set; }
    public List<VisualizationMode> SupportedModes { get; set; } = new();
    public string DefaultParametersJson { get; set; } = "{}";
    public string CameraSettingsJson { get; set; } = "{}";
}
