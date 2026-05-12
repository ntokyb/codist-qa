using System.Text;

namespace Codist.QA.Backend.UnitTests;

public sealed class GitHubWebhookSignatureVerifierTests
{
    [Fact]
    public void Accepts_matching_signature()
    {
        const string secret = "engineiq-webhook";
        const string payload = """{"action":"opened","number":42}""";
        var sig = Sign(secret, payload);

        Assert.True(GitHubWebhookSignatureVerifier.IsValid(secret, payload, sig));
    }

    [Fact]
    public void Rejects_wrong_secret()
    {
        const string payload = "{}";
        var sig = Sign("a", payload);

        Assert.False(GitHubWebhookSignatureVerifier.IsValid("b", payload, sig));
    }

    [Fact]
    public void Rejects_tampered_body()
    {
        const string secret = "s3cr3t";
        const string real = """{"number":1}""";
        var sig = Sign(secret, real);

        Assert.False(GitHubWebhookSignatureVerifier.IsValid(secret, """{"number":2}""", sig));
    }

    [Fact]
    public void Rejects_bad_header_shape()
    {
        Assert.False(GitHubWebhookSignatureVerifier.IsValid("k", "{}", "md5=beef"));
        Assert.False(GitHubWebhookSignatureVerifier.IsValid("k", "{}", null!));
    }

    private static string Sign(string secret, string payload)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return "sha256=" + Convert.ToHexString(hash).ToLowerInvariant();
    }
}
