namespace Codist.QA.Backend.UnitTests;

public sealed class InMemoryPullReviewJobQueueTests
{
    private readonly InMemoryPullReviewJobQueue _q = new();

    [Fact]
    public void Preserves_fifo_order()
    {
        var a = new PullReviewJob("codist/a", 1, "aaa");
        var b = new PullReviewJob("codist/b", 2, "bbb");
        Assert.True(_q.TryEnqueue(a));
        Assert.True(_q.TryEnqueue(b));
        Assert.Equal(2, _q.PendingCount);

        Assert.True(_q.TryDequeue(out PullReviewJob? first));
        Assert.True(_q.TryDequeue(out PullReviewJob? second));
        Assert.Equal(a, first);
        Assert.Equal(b, second);
        _q.Complete(a);
        _q.Complete(b);
    }

    [Fact]
    public void Duplicate_pr_is_rejected_until_completed()
    {
        var job = new PullReviewJob("codist/repo", 7, "sha");
        Assert.True(_q.TryEnqueue(job));
        Assert.False(_q.TryEnqueue(job with { HeadSha = "other" }));

        Assert.True(_q.TryDequeue(out PullReviewJob? dequeued));
        Assert.Equal(job, dequeued);
        Assert.False(_q.TryEnqueue(job with { HeadSha = "other" }));

        _q.Complete(job);
        Assert.True(_q.TryEnqueue(job with { HeadSha = "new-sha" }));
    }
}
