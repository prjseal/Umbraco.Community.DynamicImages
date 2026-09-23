namespace Umbraco.Community.DynamicImages.Api.Controllers;

public enum LinkedPathOutcome
{
    /// <summary>The last segment was found on a document type the path reaches.</summary>
    Found,

    /// <summary>A segment names no property on any document type reached so far.</summary>
    PropertyMissing,

    /// <summary>A segment before the last is not a content reference, so the path cannot go on.</summary>
    NotAReference,

    /// <summary>A reference before the last segment leads to no document type anyone can name.</summary>
    NoTargets
}

public sealed record LinkedPathResult<TType, TProperty>(
    LinkedPathOutcome Outcome,
    TType? Owner = default,
    TProperty? Property = default,
    string? Inference = null,
    string? FailedSegment = null);

/// <summary>
/// Walks a dotted property path - <c>author.company.logo</c> - across document types, one content
/// reference at a time, so the designer can offer a dropdown for every hop rather than only the
/// first. At each hop the next set of document types is what the reference can point at, inferred
/// exactly as a single hop is. Generic over the type and property models so the walk can be tested
/// without Umbraco's.
/// </summary>
public static class LinkedPath
{
    /// <param name="start">The document types the path starts from.</param>
    /// <param name="segments">The path, split on dots. At most <c>PropertyPath.MaxHops</c> + 1 long.</param>
    /// <param name="find">A property by alias on any of some document types, with the one it was found on.</param>
    /// <param name="follow">
    /// What a property can point at, and how that was worked out - or null targets when the
    /// property is not a content reference at all.
    /// </param>
    public static async Task<LinkedPathResult<TType, TProperty>> WalkAsync<TType, TProperty>(
        IReadOnlyList<TType> start,
        IReadOnlyList<string> segments,
        Func<IReadOnlyList<TType>, string, (TType Owner, TProperty Property)?> find,
        Func<TType, TProperty, Task<(IReadOnlyList<TType>? Targets, string Inference)>> follow)
    {
        var owners = start;
        string? inference = null;

        for (var index = 0; index < segments.Count; index++)
        {
            var segment = segments[index];
            if (find(owners, segment) is not { } found)
            {
                return new LinkedPathResult<TType, TProperty>(LinkedPathOutcome.PropertyMissing, FailedSegment: segment);
            }

            if (index == segments.Count - 1)
            {
                return new LinkedPathResult<TType, TProperty>(LinkedPathOutcome.Found, found.Owner, found.Property, inference);
            }

            var (targets, how) = await follow(found.Owner, found.Property);
            if (targets is null) return new LinkedPathResult<TType, TProperty>(LinkedPathOutcome.NotAReference, FailedSegment: segment);
            if (targets.Count == 0) return new LinkedPathResult<TType, TProperty>(LinkedPathOutcome.NoTargets, Inference: how, FailedSegment: segment);

            owners = targets;
            inference = how;
        }

        return new LinkedPathResult<TType, TProperty>(LinkedPathOutcome.PropertyMissing);
    }
}
