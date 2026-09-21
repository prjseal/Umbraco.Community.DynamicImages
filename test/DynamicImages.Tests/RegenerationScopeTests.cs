using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Community.DynamicImages.Core.Services;
using Umbraco.Community.DynamicImages.NotificationHandlers;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The flag that stops a regeneration's own publish being rendered a second time. Without it
/// every manual regeneration was two renders and two media saves, and a bulk run over N documents
/// was 2N of each.
/// </summary>
public class RegenerationScopeTests
{
    [Fact]
    public void IsActive_IsFalseOutsideAnyScope()
        => Assert.False(RegenerationScope.IsActive);

    [Fact]
    public void Begin_OpensAndClosesTheScope()
    {
        using (RegenerationScope.Begin())
        {
            Assert.True(RegenerationScope.IsActive);
        }

        Assert.False(RegenerationScope.IsActive);
    }

    [Fact]
    public void Begin_ClosesBackToWhereItStartedWhenNested()
    {
        using (RegenerationScope.Begin())
        {
            using (RegenerationScope.Begin())
            {
                Assert.True(RegenerationScope.IsActive);
            }

            // The inner scope restores the outer one rather than clearing the flag outright -
            // otherwise a regeneration triggered inside a regeneration would open a hole in it.
            Assert.True(RegenerationScope.IsActive);
        }

        Assert.False(RegenerationScope.IsActive);
    }

    [Fact]
    public async Task Begin_FlowsIntoAwaitedWork()
    {
        // The publish the scope guards is raised deeper down the same logical call stack, across
        // at least one await, which is the whole reason this is an AsyncLocal.
        using (RegenerationScope.Begin())
        {
            await Task.Yield();
            Assert.True(RegenerationScope.IsActive);

            await Task.Run(() => Assert.True(RegenerationScope.IsActive));
        }
    }

    [Fact]
    public async Task Begin_DoesNotLeakIntoASiblingFlow()
    {
        // A bulk job regenerates several documents at once on thread-pool threads. One document's
        // scope must not suppress another document's publish handler.
        var sibling = Task.Run(async () =>
        {
            await Task.Delay(20);
            return RegenerationScope.IsActive;
        });

        using (RegenerationScope.Begin())
        {
            Assert.False(await sibling);
        }
    }

    /// <summary>
    /// Inside the scope the publish handler must stand down before it touches a single one of its
    /// dependencies - which is what the nulls here assert. The paired case below shows the same
    /// call does reach them when the scope is closed, so this is measuring the stand-down and not
    /// some other early return.
    /// </summary>
    [Fact]
    public async Task PublishHandler_DoesNothingInsideTheScope()
    {
        var handler = new DynamicImagesNotificationHandler(null!, null!, null!, null!, null!, null!, null!);

        using (RegenerationScope.Begin())
        {
            await handler.HandleAsync(Notification(), CancellationToken.None);
        }
    }

    [Fact]
    public async Task PublishHandler_RunsOutsideTheScope()
    {
        var handler = new DynamicImagesNotificationHandler(null!, null!, null!, null!, null!, null!, null!);

        await Assert.ThrowsAsync<NullReferenceException>(
            () => handler.HandleAsync(Notification(), CancellationToken.None));
    }

    private static ContentPublishingNotification Notification()
        => new(Array.Empty<IContent>(), new EventMessages());
}
