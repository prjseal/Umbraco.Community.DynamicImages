using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Umbraco.Community.DynamicImages.Core.Media;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// Templates are editable in the backoffice, so a "path" source that escaped wwwroot would be an
/// arbitrary file read for anyone with section access. These are the tests that say it cannot.
/// </summary>
public class WebRootPathTests : IDisposable
{
    private readonly string _root = Path.Combine(Path.GetTempPath(), $"di-tests-{Guid.NewGuid():N}", "wwwroot");
    private readonly IWebHostEnvironment _environment;

    public WebRootPathTests()
    {
        Directory.CreateDirectory(Path.Combine(_root, "assets"));
        _environment = new StubEnvironment(_root);
    }

    public void Dispose()
    {
        var parent = Directory.GetParent(_root)?.FullName;
        if (parent is not null && Directory.Exists(parent)) Directory.Delete(parent, recursive: true);

        GC.SuppressFinalize(this);
    }

    [Theory]
    [InlineData("/assets/og.png")]
    [InlineData("assets/og.png")]
    [InlineData("~/assets/og.png")]
    [InlineData("\\assets\\og.png")]
    [InlineData("/assets/nested/../og.png")]
    public void Resolve_AcceptsPathsInsideTheWebRoot(string path)
    {
        var resolved = WebRootPath.Resolve(_environment, path);

        Assert.NotNull(resolved);
        Assert.StartsWith(Path.GetFullPath(_root), resolved);
    }

    [Theory]
    [InlineData("../secrets.txt")]
    [InlineData("/../secrets.txt")]
    [InlineData("assets/../../secrets.txt")]
    [InlineData("/assets/../../../etc/passwd")]
    public void Resolve_RejectsPathsThatClimbOutOfTheWebRoot(string path)
        => Assert.Null(WebRootPath.Resolve(_environment, path));

    [Fact]
    public void Resolve_TreatsALeadingSlashAsWebRootRelative()
    {
        // "/assets/og.png" means "assets/og.png under wwwroot", the way a browser reads it - not
        // the filesystem root.
        var resolved = WebRootPath.Resolve(_environment, "/etc/passwd");

        Assert.Equal(Path.GetFullPath(Path.Combine(_root, "etc", "passwd")), resolved);
    }

    [Fact]
    public void Resolve_RejectsAPathThatIsStillRootedAfterTrimming()
    {
        // A Windows drive path survives the leading-slash trim, so it is caught explicitly.
        var rooted = OperatingSystem.IsWindows() ? @"C:\Windows\win.ini" : "//etc/passwd/../../etc/passwd";

        var resolved = WebRootPath.Resolve(_environment, rooted);

        Assert.True(resolved is null || resolved.StartsWith(Path.GetFullPath(_root)),
            $"'{rooted}' resolved outside the web root: {resolved}");
    }

    [Fact]
    public void Resolve_RejectsASiblingFolderWithTheSamePrefix()
    {
        // "/wwwroot-evil" must not pass as being inside "/wwwroot", which a bare StartsWith
        // comparison without a trailing separator would allow.
        var sibling = Path.GetFileName(_root) + "-evil";

        Assert.Null(WebRootPath.Resolve(_environment, $"../{sibling}/og.png"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Resolve_TreatsAnEmptyPathAsAbsent(string? path)
        => Assert.Null(WebRootPath.Resolve(_environment, path));

    [Fact]
    public void IsSafe_AgreesWithResolve()
    {
        Assert.True(WebRootPath.IsSafe(_environment, "/assets/og.png"));
        Assert.False(WebRootPath.IsSafe(_environment, "../../etc/passwd"));
    }

    private sealed class StubEnvironment(string webRoot) : IWebHostEnvironment
    {
        public string WebRootPath { get; set; } = webRoot;
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
        public string ApplicationName { get; set; } = "Tests";
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public string ContentRootPath { get; set; } = webRoot;
        public string EnvironmentName { get; set; } = "Testing";
    }
}
