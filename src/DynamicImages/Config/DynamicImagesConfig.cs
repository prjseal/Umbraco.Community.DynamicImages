using DynamicImages.Models;

namespace DynamicImages.Config;

public class DynamicImagesConfig
{
    public bool Enabled { get; set; }

    public List<Instruction> Instructions { get; set; }

    public List<string> Fonts { get; set; }
}