using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Core.Services;
using Xunit;
using Template = Umbraco.Community.DynamicImages.Core.Models.Template;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>The real <see cref="TemplateService"/> over in-memory repositories.</summary>
public class TemplateServiceTests
{
    private readonly InMemoryTemplateRepository _templates = new();
    private readonly InMemoryTemplateFolderRepository _folders = new();

    private TemplateService Service() => ServiceFakes.TemplateService(_templates, _folders);

    private async Task<Template> Create(string name, Guid? parentKey = null)
    {
        var result = await Service().CreateAsync(new Template { Name = name, ParentKey = parentKey }, null);
        Assert.Equal(SaveOutcome.Saved, result.Outcome);
        return result.Template!;
    }

    private TemplateFolder Folder(string name) => _folders.Insert(new TemplateFolder { Key = Guid.NewGuid(), Name = name });

    // ------------------------------------------------------------ duplicate to

    [Fact]
    public async Task Duplicating_into_a_folder_puts_the_copy_there_and_leaves_the_original()
    {
        var social = Folder("Social");
        var original = await Create("Card");

        var result = await Service().DuplicateAsync(original.Key, social.Key, null);

        Assert.Equal(SaveOutcome.Saved, result.Outcome);
        var copy = result.Template!;
        Assert.NotEqual(original.Key, copy.Key);
        Assert.Equal(social.Key, _templates.Get(copy.Key)!.ParentKey);
        Assert.Equal("Card (copy)", copy.Name);
        Assert.NotEqual(original.Alias, copy.Alias);
        Assert.Null(_templates.Get(original.Key)!.ParentKey);
    }

    [Fact]
    public async Task Duplicating_to_the_root_takes_the_copy_out_of_its_folder()
    {
        var social = Folder("Social");
        var original = await Create("Card", social.Key);

        var result = await Service().DuplicateAsync(original.Key, null, null);

        Assert.Null(_templates.Get(result.Template!.Key)!.ParentKey);
    }

    [Fact]
    public async Task Duplicating_into_a_folder_that_does_not_exist_is_refused_and_copies_nothing()
    {
        var original = await Create("Card");

        var result = await Service().DuplicateAsync(original.Key, Guid.NewGuid(), null);

        Assert.Equal(SaveOutcome.TargetNotFound, result.Outcome);
        Assert.Single(_templates.GetAll());
    }

    [Fact]
    public async Task Duplicating_a_template_that_does_not_exist_is_not_found()
        => Assert.Equal(SaveOutcome.NotFound, (await Service().DuplicateAsync(Guid.NewGuid(), null, null)).Outcome);

    [Fact]
    public async Task A_duplicate_gives_its_layers_new_keys()
    {
        var original = await Create("Card");
        var stored = _templates.Get(original.Key)!;
        stored.Layers.Add(new Core.Models.Layers.RectLayer { Key = Guid.NewGuid() });
        _templates.Update(stored, null, null);

        var copy = (await Service().DuplicateAsync(original.Key, null, null)).Template!;

        Assert.NotEqual(stored.Layers[0].Key, Assert.Single(copy.Layers).Key);
    }

    // ------------------------------------------------------------ enable / disable

    [Fact]
    public async Task Disabling_writes_the_flag_and_bumps_updated_so_a_stale_save_conflicts()
    {
        var template = await Create("Card");
        var loaded = _templates.Get(template.Key)!.UpdatedUtc;
        await Task.Delay(5);

        Assert.Equal(EnableOutcome.Changed, await Service().SetEnabledAsync(template.Key, false));

        var stored = _templates.Get(template.Key)!;
        Assert.False(stored.IsEnabled);
        Assert.True(stored.UpdatedUtc > loaded);
    }

    [Fact]
    public async Task Asking_for_the_state_a_template_is_already_in_changes_nothing()
    {
        var template = await Create("Card");
        var before = _templates.Get(template.Key)!.UpdatedUtc;

        Assert.Equal(EnableOutcome.Unchanged, await Service().SetEnabledAsync(template.Key, true));
        Assert.Equal(before, _templates.Get(template.Key)!.UpdatedUtc);
    }

    [Fact]
    public async Task Enabling_a_template_that_does_not_exist_is_not_found()
        => Assert.Equal(EnableOutcome.NotFound, await Service().SetEnabledAsync(Guid.NewGuid(), true));
}
