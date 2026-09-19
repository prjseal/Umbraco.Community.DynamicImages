using System.Text.Json;
using Umbraco.Community.DynamicImages.Core.Json;
using Umbraco.Community.DynamicImages.Core.Models;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class TemplateJsonMigrator : ITemplateJsonMigrator
{
    public int ReadSchemaVersion(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return 0;

        try
        {
            using var document = JsonDocument.Parse(json);
            return document.RootElement.TryGetProperty("schemaVersion", out var element) &&
                   element.TryGetInt32(out var version)
                ? version
                : 1;
        }
        catch (JsonException)
        {
            return 0;
        }
    }

    public Template? Deserialize(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;

        var version = ReadSchemaVersion(json);

        // Schema 2 is the first version the backoffice ever wrote, so there is nothing below it to
        // upgrade yet. The chain is here so version 3 has somewhere obvious to plug in: add a
        // `if (version < 3) json = UpgradeTo3(json);` step above the deserialise.
        if (version > DynamicImagesConstants.CurrentSchemaVersion)
        {
            throw new InvalidOperationException(
                $"This template was written by a newer version of Dynamic Images (schema {version}); this package understands up to {DynamicImagesConstants.CurrentSchemaVersion}.");
        }

        var template = JsonSerializer.Deserialize<Template>(json, DynamicImagesJsonOptions.Default);
        if (template is not null)
        {
            template.SchemaVersion = DynamicImagesConstants.CurrentSchemaVersion;
        }

        return template;
    }
}
