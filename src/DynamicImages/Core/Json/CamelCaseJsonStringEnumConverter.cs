using System.Text.Json;
using System.Text.Json.Serialization;

namespace Umbraco.Community.DynamicImages.Core.Json;

/// <summary>
/// Writes enums as strings rather than integers, with camelCase as the fallback naming policy.
/// <para>
/// The names themselves are pinned member by member with
/// <see cref="JsonStringEnumMemberNameAttribute"/>. That is deliberate: the Management API
/// serialises responses with the host's own options, whose enum converter carries no naming
/// policy, so a policy alone would produce PascalCase on the wire while the stored document held
/// camelCase - and the designer would read every enum as its default without any error.
/// Pinning the name makes the two agree whichever converter runs.
/// </para>
/// </summary>
public sealed class CamelCaseJsonStringEnumConverter() : JsonStringEnumConverter(JsonNamingPolicy.CamelCase);
