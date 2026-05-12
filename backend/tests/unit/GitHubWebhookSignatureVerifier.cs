using System.Security.Cryptography;
using System.Text;

namespace Codist.QA.Backend.UnitTests;

/// <summary>GitHub-style <c>X-Hub-Signature-256: sha256=&lt;hex&gt;</c> over the raw request body.</summary>
public static class GitHubWebhookSignatureVerifier
{
    private const string Prefix = "sha256=";

    public static bool IsValid(string secret, string payloadUtf8, string? signatureHeader)
    {
        if (string.IsNullOrEmpty(signatureHeader) ||
            !signatureHeader.StartsWith(Prefix, StringComparison.Ordinal))
            return false;

        var hex = signatureHeader.AsSpan(Prefix.Length);
        if (hex.Length != 64)
            return false;

        byte[] provided;
        try
        {
            provided = Convert.FromHexString(hex);
        }
        catch (FormatException)
        {
            return false;
        }

        if (provided.Length != 32)
            return false;

        var key = Encoding.UTF8.GetBytes(secret);
        var body = Encoding.UTF8.GetBytes(payloadUtf8);
        using var hmac = new HMACSHA256(key);
        var mac = hmac.ComputeHash(body);

        return CryptographicOperations.FixedTimeEquals(mac, provided);
    }
}
