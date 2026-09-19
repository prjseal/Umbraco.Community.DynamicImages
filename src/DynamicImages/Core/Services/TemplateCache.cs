using Umbraco.Community.DynamicImages.Core.Models;
using Umbraco.Community.DynamicImages.Persistence;

namespace Umbraco.Community.DynamicImages.Core.Services;

public sealed class TemplateCache(IServiceScopeFactory scopeFactory) : ITemplateCache
{
    private readonly Lock _lock = new();

    private IReadOnlyList<Template>? _all;
    private Dictionary<string, List<Template>>? _byDocType;

    public IReadOnlyList<Template> GetAll()
    {
        EnsureLoaded();
        return _all!;
    }

    public IReadOnlyList<Template> GetForDocType(string docTypeAlias)
    {
        EnsureLoaded();
        return _byDocType!.GetValueOrDefault(docTypeAlias, []);
    }

    public Template? Get(Guid key)
    {
        EnsureLoaded();
        return _all!.FirstOrDefault(x => x.Key == key);
    }

    public void Clear()
    {
        lock (_lock)
        {
            _all = null;
            _byDocType = null;
        }
    }

    private void EnsureLoaded()
    {
        if (_all is not null) return;

        lock (_lock)
        {
            if (_all is not null) return;

            // The cache is a singleton but the repository is scoped (it needs a database scope),
            // so it is resolved per load rather than injected.
            using var scope = scopeFactory.CreateScope();
            var repository = scope.ServiceProvider.GetRequiredService<ITemplateRepository>();

            var all = repository.GetAll();

            var index = new Dictionary<string, List<Template>>(StringComparer.OrdinalIgnoreCase);
            foreach (var template in all.Where(t => t.IsEnabled))
            {
                foreach (var alias in template.DocTypeAliases)
                {
                    if (string.IsNullOrWhiteSpace(alias)) continue;
                    if (!index.TryGetValue(alias, out var list))
                    {
                        list = [];
                        index[alias] = list;
                    }
                    list.Add(template);
                }
            }

            _byDocType = index;
            _all = all;
        }
    }
}
