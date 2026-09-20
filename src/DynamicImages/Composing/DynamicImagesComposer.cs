using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Community.DynamicImages.Api.Swagger;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.DynamicImages.Configuration;
using Umbraco.Community.DynamicImages.Core.Cache;
using Umbraco.Community.DynamicImages.Core.Fonts;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Umbraco.Community.DynamicImages.Core.Media;
using Umbraco.Community.DynamicImages.Core.Rendering;
using Umbraco.Community.DynamicImages.Core.Rendering.Layers;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.Migrations;
using Umbraco.Community.DynamicImages.NotificationHandlers;
using Umbraco.Community.DynamicImages.Persistence;
using Umbraco.Community.DynamicImages.Security;

namespace Umbraco.Community.DynamicImages.Composing;

public class DynamicImagesComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.Configure<DynamicImagesOptions>(builder.Config.GetSection(DynamicImagesOptions.SectionName));

        // Deliberately no early return on Enabled or on there being no fonts. v1 skipped
        // registration entirely, which is why nothing could be configured without a restart - and
        // why the backoffice section could not exist at all until the site was already working.
        builder.Components().Append<DynamicImagesMigrationComponent>();

        // The v1 import is deliberately NOT a component. Components initialise before the rest
        // of the boot sequence, which on a first boot put the import ahead of uSync creating the
        // document types and made the package's very first log line a warning that its target
        // document type does not exist. UmbracoApplicationStarted runs after every component.
        builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, DynamicImagesStartupHandler>();

        // Left registered permanently; it does nothing unless the import above armed it.
        builder.Services.AddSingleton<LegacyImportRetryState>();
        builder.AddNotificationAsyncHandler<ContentTypeSavedNotification, LegacyImportRetryHandler>();

        RegisterPersistence(builder);
        RegisterRendering(builder);
        RegisterServices(builder);
        RegisterSecurity(builder);

        builder.CacheRefreshers().Add<DynamicImagesCacheRefresher>();

        // Its own Swagger document alongside Umbraco's, at /umbraco/swagger.
        builder.Services.ConfigureOptions<DynamicImagesSwaggerConfiguration>();

        builder.AddNotificationAsyncHandler<ContentPublishingNotification, DynamicImagesNotificationHandler>();
        builder.AddNotificationHandler<MediaSavedNotification, FontMediaChangedHandler>();
        builder.AddNotificationHandler<MediaDeletedNotification, FontMediaChangedHandler>();
    }

    private static void RegisterPersistence(IUmbracoBuilder builder)
    {
        // Scoped: both take a database scope from the ambient Umbraco scope.
        builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();
        builder.Services.AddScoped<IFontRepository, FontRepository>();
        builder.Services.AddSingleton<ITemplateJsonMigrator, TemplateJsonMigrator>();
    }

    private static void RegisterRendering(IUmbracoBuilder builder)
    {
        builder.WithCollectionBuilder<LayerRendererCollectionBuilder>()
            .Append<RectLayerRenderer>()
            .Append<ImageLayerRenderer>()
            .Append<TextLayerRenderer>()
            .Append<BadgesLayerRenderer>();

        builder.Services.AddSingleton<IDynamicImageRenderer, DynamicImageRenderer>();
        builder.Services.AddSingleton<IImageSourceProvider, ImageSourceProvider>();
        builder.Services.AddSingleton<IDynamicImageMediaWriter, DynamicImageMediaWriter>();
        builder.Services.AddSingleton<IFontFileProvider, FontFileProvider>();
        builder.Services.AddSingleton<IFontRegistry, FontRegistry>();

        RegisterWebFonts(builder);
    }

    private static void RegisterWebFonts(IUmbracoBuilder builder)
    {
        // One named client for the provider CSS APIs and the file downloads. The buffer cap is
        // what makes an oversize file throw out of GetByteArrayAsync; the User-Agent is never a
        // browser's, so Google answers with one full file rather than seven subsets.
        builder.Services.AddHttpClient(DynamicImagesConstants.WebFontHttpClientName, (services, client) =>
        {
            var webFonts = services.GetRequiredService<IOptionsMonitor<DynamicImagesOptions>>().CurrentValue.WebFonts;

            client.Timeout = TimeSpan.FromSeconds(Math.Max(1, webFonts.TimeoutSeconds));
            client.MaxResponseContentBufferSize = Math.Max(1, webFonts.MaxBytes);
            client.DefaultRequestHeaders.UserAgent.ParseAdd(DynamicImagesConstants.UserAgent);
        }).ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler { MaxAutomaticRedirections = 5 });

        builder.Services.AddSingleton<IFontCacheRoot, HostingFontCacheRoot>();
        builder.Services.AddSingleton<IRemoteFontFetcher, RemoteFontFetcher>();
        builder.Services.AddSingleton<IWebFontResolver, WebFontResolver>();
    }

    private static void RegisterServices(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<ITemplateCache, TemplateCache>();

        // Scoped, because they compose the scoped repositories.
        builder.Services.AddScoped<ITemplateService, TemplateService>();
        builder.Services.AddScoped<ITemplateValidator, TemplateValidator>();
        builder.Services.AddScoped<IFontService, FontService>();
        builder.Services.AddScoped<ILegacyConfigImporter, LegacyConfigImporter>();
        builder.Services.AddScoped<IRegenerationService, RegenerationService>();
        builder.Services.AddScoped<IHealthService, HealthService>();
        builder.Services.AddScoped<ISyncService, SyncService>();

        builder.Services.AddSingleton<IRegenerationJobStore, RegenerationJobStore>();
    }

    private static void RegisterSecurity(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<IAuthorizationHandler, DynamicImagesSectionAccessHandler>();
        builder.Services.AddSingleton<IAuthorizationHandler, RegenerateHandler>();

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(DynamicImagesConstants.SectionAccessPolicy, policy =>
            {
                policy.AddAuthenticationSchemes(Constants.Security.BackOfficeAuthenticationType);
                policy.Requirements.Add(new DynamicImagesSectionAccessRequirement(DynamicImagesConstants.SectionAlias));
            });

            options.AddPolicy(DynamicImagesConstants.RegeneratePolicy, policy =>
            {
                policy.AddAuthenticationSchemes(Constants.Security.BackOfficeAuthenticationType);
                policy.Requirements.Add(new RegenerateRequirement());
            });
        });
    }
}
