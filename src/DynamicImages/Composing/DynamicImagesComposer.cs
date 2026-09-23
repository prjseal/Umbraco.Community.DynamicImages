using System.Net;
using System.Net.Sockets;
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

        // Deliberately no early return on Enabled or on there being no fonts: registration is
        // unconditional so that everything can be configured without a restart, and so the
        // backoffice section exists before the site is fully set up.
        builder.Components().Append<DynamicImagesMigrationComponent>();

        // File sync in Import mode is deliberately NOT a component. Components initialise before
        // the rest of the boot sequence, which on a first boot puts it ahead of uSync creating the
        // document types. UmbracoApplicationStarted runs after every component.
        builder.AddNotificationAsyncHandler<UmbracoApplicationStartedNotification, DynamicImagesStartupHandler>();

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
        builder.Services.AddScoped<ITemplateFolderRepository, TemplateFolderRepository>();
        builder.Services.AddScoped<IFontFolderRepository, FontFolderRepository>();
        builder.Services.AddScoped<IFontFamilyRepository, FontFamilyRepository>();
        builder.Services.AddSingleton<ITemplateJsonMigrator, TemplateJsonMigrator>();
    }

    private static void RegisterRendering(IUmbracoBuilder builder)
    {
        builder.WithCollectionBuilder<LayerRendererCollectionBuilder>()
            .Append<RectLayerRenderer>()
            .Append<ImageLayerRenderer>()
            .Append<TextLayerRenderer>()
            .Append<BadgesLayerRenderer>();

        // Singleton, so the concurrency cap is per process rather than per render: a designer
        // dragging, a bulk job and a publish all queue against the same gate.
        builder.Services.AddSingleton<RenderGate>();

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
        }).ConfigurePrimaryHttpMessageHandler(BuildWebFontHandler);

        builder.Services.AddSingleton<IFontCacheRoot, HostingFontCacheRoot>();

        builder.Services.AddSingleton<IRemoteFontFetcher, RemoteFontFetcher>();
        builder.Services.AddSingleton<IWebFontResolver, WebFontResolver>();
    }

    /// <summary>
    /// The handler web fonts are fetched through, built so the checks on a URL cannot be talked
    /// out of by the far end.
    /// <para>
    /// Redirects are off: following one meant the https / public-host checks applied to the URL
    /// an editor typed and not to the URL that was actually fetched, so a 302 walked straight
    /// past them. Google and Bunny both serve their files without redirects, and a direct URL is
    /// supposed to be the file, so refusing one costs nothing real.
    /// </para>
    /// <para>
    /// The connect callback resolves the host itself and dials a specific address. That is what
    /// closes the DNS-rebinding window: the address that was checked is the address that is
    /// connected to, with no second lookup in between for an attacker's short TTL to answer
    /// differently.
    /// </para>
    /// </summary>
    private static HttpMessageHandler BuildWebFontHandler() => new SocketsHttpHandler
    {
        AllowAutoRedirect = false,
        ConnectCallback = ConnectToPublicAddressAsync,
    };

    private static async ValueTask<Stream> ConnectToPublicAddressAsync(
        SocketsHttpConnectionContext context, CancellationToken cancellationToken)
    {
        var endPoint = context.DnsEndPoint;

        var addresses = IPAddress.TryParse(endPoint.Host, out var literal)
            ? [literal]
            : await Dns.GetHostAddressesAsync(endPoint.Host, cancellationToken);

        var allowed = addresses.FirstOrDefault(PublicAddressGuard.IsAllowed);
        if (allowed is null)
        {
            // HttpRequestException rather than a custom type: it is what the callers of the
            // fetcher already catch, and what turns into an editor-facing message.
            throw new HttpRequestException(addresses.Length == 0
                ? $"'{endPoint.Host}' could not be resolved."
                : PublicAddressGuard.Describe(addresses[0]));
        }

        var socket = new Socket(SocketType.Stream, ProtocolType.Tcp) { NoDelay = true };

        try
        {
            await socket.ConnectAsync(new IPEndPoint(allowed, endPoint.Port), cancellationToken);
            return new NetworkStream(socket, ownsSocket: true);
        }
        catch
        {
            socket.Dispose();
            throw;
        }
    }

    private static void RegisterServices(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<ITemplateCache, TemplateCache>();

        // Scoped, because they compose the scoped repositories.
        builder.Services.AddScoped<ITemplateService, TemplateService>();
        builder.Services.AddScoped<ITemplateFolderService, TemplateFolderService>();
        builder.Services.AddScoped<ITemplateValidator, TemplateValidator>();
        builder.Services.AddScoped<IFontService, FontService>();
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
