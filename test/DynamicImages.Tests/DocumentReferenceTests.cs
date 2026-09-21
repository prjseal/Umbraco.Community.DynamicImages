using Umbraco.Community.DynamicImages.Core.Rendering;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

public class DocumentReferenceTests
{
    private static readonly Guid First = new("bd6a503a-1c34-4a1e-9f0a-6d7e8f9a0b1c");
    private static readonly Guid Second = new("13ea3528-2b45-4c6d-8e7f-90a1b2c3d4e5");

    [Fact]
    public void ResolveKeys_ReadsASingleUdi()
        => Assert.Equal([First], DocumentReference.ResolveKeys($"umb://document/{First:N}"));

    [Fact]
    public void ResolveKeys_ReadsACommaSeparatedPairInOrder()
    {
        // The shape the fixtures actually store, and the one MediaSource does not handle at all.
        var keys = DocumentReference.ResolveKeys($"umb://document/{First:N},umb://document/{Second:N}");

        Assert.Equal([First, Second], keys);
    }

    [Fact]
    public void ResolveKeys_ReadsABareGuid()
        => Assert.Equal([First], DocumentReference.ResolveKeys(First.ToString()));

    [Fact]
    public void ResolveKeys_ReadsAJsonArrayOfUdis()
        => Assert.Equal([First, Second],
            DocumentReference.ResolveKeys($"""["umb://document/{First:N}","umb://document/{Second:N}"]"""));

    [Fact]
    public void ResolveKeys_ReadsAJsonArrayOfObjects()
        => Assert.Equal([First], DocumentReference.ResolveKeys($$"""[{"key":"{{First}}"}]"""));

    [Fact]
    public void ResolveKeys_ReadsAJsonArrayOfContentKeyObjects()
        => Assert.Equal([First], DocumentReference.ResolveKeys($$"""[{"contentKey":"umb://document/{{First:N}}"}]"""));

    [Fact]
    public void ResolveKeys_IgnoresAMediaUdi()
    {
        // The entity-type guard is the whole point: without it this key is handed to the content
        // cache, which is where the original bug came from in reverse.
        Assert.Empty(DocumentReference.ResolveKeys($"umb://media/{First:N}"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData("[]")]
    [InlineData("not json")]
    [InlineData("{ broken")]
    public void ResolveKeys_TreatsAnythingElseAsAbsentRatherThanThrowing(string? value)
        => Assert.Empty(DocumentReference.ResolveKeys(value));

    [Fact]
    public void ResolveFirstKey_TakesTheFirstNode()
        => Assert.Equal(First, DocumentReference.ResolveFirstKey($"umb://document/{First:N},umb://document/{Second:N}"));

    [Fact]
    public void ResolveFirstKey_OnNothing_IsNull()
        => Assert.Null(DocumentReference.ResolveFirstKey("Hello world"));

    [Fact]
    public void LooksLikeDocumentReference_IsTrueForOneDocumentUdi()
        => Assert.True(DocumentReference.LooksLikeDocumentReference($"umb://document/{First:N}"));

    [Fact]
    public void LooksLikeDocumentReference_IsTrueForManyDocumentUdis()
        => Assert.True(DocumentReference.LooksLikeDocumentReference(
            $"umb://document/{First:N},umb://document/{Second:N}"));

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("Hello world")]
    public void LooksLikeDocumentReference_IsFalseForOrdinaryText(string? value)
        => Assert.False(DocumentReference.LooksLikeDocumentReference(value));

    [Fact]
    public void LooksLikeDocumentReference_IsFalseForABareGuid()
    {
        // A bare GUID is a string somebody might legitimately want drawn, so it must not trigger
        // the "print the linked node's name instead" behaviour.
        Assert.False(DocumentReference.LooksLikeDocumentReference(First.ToString()));
    }

    [Fact]
    public void LooksLikeDocumentReference_IsFalseForAMediaUdi()
        => Assert.False(DocumentReference.LooksLikeDocumentReference($"umb://media/{First:N}"));

    [Fact]
    public void LooksLikeDocumentReference_IsFalseWhenOnlySomeTokensAreDocumentUdis()
        => Assert.False(DocumentReference.LooksLikeDocumentReference($"umb://document/{First:N},Hello world"));
}
