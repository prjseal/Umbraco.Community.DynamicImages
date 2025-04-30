namespace DynamicImages.Models;

public class Instruction
{
    public string MediaFolder { get; set; }
    public string DocTypeAlias { get; set; }
    public string Author { get; set; }
    public string TargetPropertyAlias { get; set; }
    public string SourceImagePath { get; set; }
    public List<Layer> Layers { get; set; }
}