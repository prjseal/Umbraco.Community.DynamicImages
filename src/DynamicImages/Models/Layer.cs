namespace DynamicImages.Models;
public class Layer
{
    public LayerType LayerType { get; set; }
    public string? ImagePath { get; set; }
    public string? SourcePropertyAlias { get; set; }
    public int xPosition { get; set; }
    public int yPosition { get; set; }
    public string Colour { get; set; }
}