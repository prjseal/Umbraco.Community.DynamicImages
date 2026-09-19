using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

/// <summary>
/// Reads a stored template document of any schema version and returns the current model.
/// Upgrades happen on read and are written back on the next save, so a package upgrade never
/// needs a data migration over the JSON blobs.
/// </summary>
public interface ITemplateJsonMigrator
{
    Template? Deserialize(string json);

    /// <summary>The schema version a document declares, defaulting to 1 when it says nothing.</summary>
    int ReadSchemaVersion(string json);
}
