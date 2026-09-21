using System.Net;
using Umbraco.Community.DynamicImages.Core.Fonts.Remote;
using Xunit;

namespace Umbraco.Community.DynamicImages.Tests;

/// <summary>
/// The address rules behind the font client's connect callback. A font URL is supplied by a
/// backoffice user and fetched by the server, so a host that resolves to the cloud metadata
/// endpoint or to something else on the site's own network is the whole attack.
/// </summary>
public class PublicAddressGuardTests
{
    [Theory]
    // Loopback and unspecified.
    [InlineData("127.0.0.1")]
    [InlineData("127.1.2.3")]
    [InlineData("0.0.0.0")]
    [InlineData("::1")]
    [InlineData("::")]
    // RFC 1918 private.
    [InlineData("10.0.0.1")]
    [InlineData("172.16.0.1")]
    [InlineData("172.31.255.254")]
    [InlineData("192.168.1.1")]
    // Link-local, and with it the cloud metadata endpoint.
    [InlineData("169.254.169.254")]
    [InlineData("169.254.0.1")]
    [InlineData("fe80::1")]
    // Carrier-grade NAT, benchmarking, multicast, broadcast.
    [InlineData("100.64.0.1")]
    [InlineData("198.18.0.1")]
    [InlineData("224.0.0.1")]
    [InlineData("255.255.255.255")]
    // IPv6 unique-local, the v6 equivalent of RFC 1918.
    [InlineData("fd00::1")]
    [InlineData("fc00::1")]
    // A v4-mapped v6 address reaches the same v4 network, so it gets the same answer.
    [InlineData("::ffff:10.0.0.1")]
    [InlineData("::ffff:169.254.169.254")]
    public void IsAllowed_RefusesAnAddressOnTheServersOwnNetwork(string address)
        => Assert.False(PublicAddressGuard.IsAllowed(IPAddress.Parse(address)));

    [Theory]
    [InlineData("8.8.8.8")]
    [InlineData("1.1.1.1")]
    [InlineData("142.250.187.238")]   // fonts.gstatic.com, at the time of writing
    [InlineData("172.15.0.1")]        // just below the 172.16/12 private block
    [InlineData("172.32.0.1")]        // just above it
    [InlineData("100.63.255.255")]    // just below the CGNAT block
    [InlineData("100.128.0.1")]       // just above it
    [InlineData("169.253.0.1")]       // just below link-local
    [InlineData("192.169.0.1")]       // just above 192.168/16
    [InlineData("2606:4700::1111")]   // Cloudflare
    [InlineData("2a00:1450:4009:81f::2003")]
    public void IsAllowed_AcceptsAPublicAddress(string address)
        => Assert.True(PublicAddressGuard.IsAllowed(IPAddress.Parse(address)));

    [Fact]
    public void Describe_NamesTheAddressItRefused()
        => Assert.Contains("169.254.169.254", PublicAddressGuard.Describe(IPAddress.Parse("169.254.169.254")));
}
