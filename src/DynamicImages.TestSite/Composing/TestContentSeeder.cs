using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace DynamicImages.TestSite.Composing;

/// <summary>
/// Gives a fresh checkout something to publish. Creates the <c>issue</c> document type the sample
/// <c>DynamicImages</c> block in appsettings.Development.json points at, plus a couple of issues to
/// publish, so the package can be exercised end to end without anyone clicking through the
/// backoffice first. Everything is created only when missing, so this is a no-op on every boot
/// after the first, and deleting a node in the backoffice does not bring it back.
/// </summary>
public class TestContentSeederComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder) => builder.Components().Append<TestContentSeeder>();
}

public class TestContentSeeder(
    IContentTypeService contentTypeService,
    IContentService contentService,
    IDataTypeService dataTypeService,
    IShortStringHelper shortStringHelper,
    ILogger<TestContentSeeder> logger) : IAsyncComponent
{
    private const string IssueAlias = "issue";

    // The well-known built-in data types. Stable across installs - these are the same GUIDs
    // Umbraco ships in Constants.DataTypes.Guids.
    private static readonly Guid TextstringGuid = new("0CC0EBA1-9960-42C9-BF9B-60E150B429AE");
    private static readonly Guid DatePickerGuid = new("5046194E-4237-453C-A547-15DB3A07C4E1");
    private static readonly Guid ImageMediaPickerGuid = new("AD9F0CF2-BDA2-45D5-9EA1-A63CFC873FD3");

    public async Task InitializeAsync(bool isRestarting, CancellationToken cancellationToken)
    {
        try
        {
            var contentType = contentTypeService.Get(IssueAlias) ?? await CreateIssueTypeAsync();
            if (contentType is null) return;

            SeedIssues(contentType);
        }
        catch (Exception ex)
        {
            // A test site that cannot seed is still a usable test site - never take boot down.
            logger.LogError(ex, "Test content seeding failed");
        }
    }

    public Task TerminateAsync(bool isRestarting, CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task<IContentType?> CreateIssueTypeAsync()
    {
        var textstring = await dataTypeService.GetAsync(TextstringGuid);
        var datePicker = await dataTypeService.GetAsync(DatePickerGuid);
        var mediaPicker = await dataTypeService.GetAsync(ImageMediaPickerGuid);

        if (textstring is null || datePicker is null || mediaPicker is null)
        {
            logger.LogWarning("Built-in data types are missing, so the 'issue' document type was not created.");
            return null;
        }

        var contentType = new ContentType(shortStringHelper, -1)
        {
            Alias = IssueAlias,
            Name = "Issue",
            Description = "A magazine issue. The Dynamic Images sample template draws its social image.",
            Icon = "icon-newspaper color-blue",
            AllowedAsRoot = true
        };

        // Aliases match the SourcePropertyAlias/TargetPropertyAlias values in the sample
        // DynamicImages block - rename one here and the sample template stops finding it.
        contentType.AddPropertyType(new PropertyType(shortStringHelper, textstring)
        {
            Alias = "author", Name = "Author", SortOrder = 1
        });
        contentType.AddPropertyType(new PropertyType(shortStringHelper, textstring)
        {
            Alias = "issueNumber", Name = "Issue number", SortOrder = 2
        });
        contentType.AddPropertyType(new PropertyType(shortStringHelper, datePicker)
        {
            Alias = "issueDate", Name = "Issue date", SortOrder = 3
        });
        contentType.AddPropertyType(new PropertyType(shortStringHelper, mediaPicker)
        {
            Alias = "authorPhoto", Name = "Author photo",
            Description = "Drawn as the circular avatar on the generated image.", SortOrder = 4
        });
        contentType.AddPropertyType(new PropertyType(shortStringHelper, mediaPicker)
        {
            Alias = "socialImage", Name = "Social image",
            Description = "Written to by Dynamic Images on publish. Leave empty.", SortOrder = 5
        });

        await contentTypeService.CreateAsync(contentType, Constants.Security.SuperUserKey);

        logger.LogInformation("Created the '{Alias}' document type for the Dynamic Images sample template.", IssueAlias);

        return contentType;
    }

    private void SeedIssues(IContentType contentType)
    {
        (string Name, string Author, string Number, DateTime Date)[] issues =
        [
            ("Anchored layouts", "Paul Seal", "42", new DateTime(2026, 1, 14)),
            ("Rendering text on images", "Paul Seal", "43", new DateTime(2026, 2, 11))
        ];

        var existing = contentService
            .GetPagedOfType(contentType.Id, 0, 100, out _, null)
            .Select(c => c.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var (name, author, number, date) in issues)
        {
            if (existing.Contains(name)) continue;

            var issue = contentService.Create(name, Constants.System.Root, contentType.Alias);
            issue.SetValue("author", author);
            issue.SetValue("issueNumber", number);
            issue.SetValue("issueDate", date);

            contentService.Save(issue);
            contentService.Publish(issue, ["*"]);

            logger.LogInformation("Seeded and published the '{Name}' issue.", name);
        }
    }
}
