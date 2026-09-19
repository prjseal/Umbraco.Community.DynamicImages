namespace Umbraco.Community.DynamicImages.Core.Models;

public class TriggerSettings
{
    /// <summary>Generate the image as part of the publish, when the target property allows it.</summary>
    public bool OnPublish { get; set; } = true;

    /// <summary>
    /// Never overwrite an image an editor picked by hand. Turning this off regenerates on every
    /// publish, which also discards manual picks.
    /// </summary>
    public bool OnlyWhenEmpty { get; set; } = true;
}
