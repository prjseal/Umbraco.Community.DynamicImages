using System.Net;
using System.Net.Sockets;

namespace Umbraco.Community.DynamicImages.Core.Fonts.Remote;

/// <summary>
/// Whether an IP address is one the server may fetch a font from.
/// <para>
/// A font URL is supplied by a backoffice user and fetched by the server, which makes it a
/// server-side request forgery surface: <c>169.254.169.254</c> is the cloud metadata endpoint,
/// <c>10.0.0.0/8</c> is whatever else is on the site's network, and a host name that resolves to
/// either passes every check that only looks at the text of the URL. This looks at the address
/// that is actually about to be dialled.
/// </para>
/// </summary>
public static class PublicAddressGuard
{
    /// <summary>Whether the server may open a connection to this address.</summary>
    public static bool IsAllowed(IPAddress address)
    {
        if (IPAddress.IsLoopback(address)) return false;
        if (address.Equals(IPAddress.Any) || address.Equals(IPAddress.IPv6Any)) return false;
        if (address.Equals(IPAddress.Broadcast) || address.Equals(IPAddress.None)) return false;

        return address.AddressFamily switch
        {
            AddressFamily.InterNetwork => IsAllowedV4(address),
            AddressFamily.InterNetworkV6 => IsAllowedV6(address),

            // Unix sockets and the rest have no business being the far end of an HTTPS fetch.
            _ => false
        };
    }

    /// <summary>Why this address is refused, for a message an editor can act on.</summary>
    public static string Describe(IPAddress address)
        => $"'{address}' is not a public address. A web font has to be served from a public host.";

    private static bool IsAllowedV4(IPAddress address)
    {
        Span<byte> bytes = stackalloc byte[4];
        if (!address.TryWriteBytes(bytes, out _)) return false;

        return bytes[0] switch
        {
            0 => false,                                     // 0.0.0.0/8, "this network"
            10 => false,                                    // RFC 1918 private
            127 => false,                                   // loopback (also caught above)
            100 => bytes[1] is < 64 or > 127,               // 100.64.0.0/10, carrier-grade NAT
            169 => bytes[1] != 254,                         // 169.254.0.0/16, link-local and cloud metadata
            172 => bytes[1] is < 16 or > 31,                // 172.16.0.0/12, RFC 1918 private
            192 => !(bytes[1] == 168                        // 192.168.0.0/16, RFC 1918 private
                     || (bytes[1] == 0 && bytes[2] == 0)    // 192.0.0.0/24, IETF protocol assignments
                     || (bytes[1] == 0 && bytes[2] == 2)),  // 192.0.2.0/24, documentation
            198 => bytes[1] is not (18 or 19)               // 198.18.0.0/15, benchmarking
                   && !(bytes[1] == 51 && bytes[2] == 100), // 198.51.100.0/24, documentation
            203 => !(bytes[1] == 0 && bytes[2] == 113),     // 203.0.113.0/24, documentation
            >= 224 => false,                                // multicast, reserved, and 255.255.255.255
            _ => true
        };
    }

    private static bool IsAllowedV6(IPAddress address)
    {
        if (address.IsIPv6LinkLocal || address.IsIPv6SiteLocal || address.IsIPv6Multicast) return false;

        // A v4-mapped address (::ffff:10.0.0.1) reaches the same v4 network, so it gets the same
        // answer the v4 address would - checking only the v6 ranges would wave it straight through.
        if (address.IsIPv4MappedToIPv6) return IsAllowedV4(address.MapToIPv4());

        Span<byte> bytes = stackalloc byte[16];
        if (!address.TryWriteBytes(bytes, out _)) return false;

        // fc00::/7, unique local - the v6 equivalent of RFC 1918.
        if ((bytes[0] & 0xFE) == 0xFC) return false;

        // ::/128 unspecified and ::1/128 loopback are covered above; anything else in ::/8 is
        // reserved or a compatibility form of a v4 address, and is not a font host either.
        return bytes[0] != 0x00;
    }
}
