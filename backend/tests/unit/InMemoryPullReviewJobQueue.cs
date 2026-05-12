namespace Codist.QA.Backend.UnitTests;

public readonly record struct PullReviewQueueKey(string RepositoryFullName, int PullRequestNumber);

public sealed record PullReviewJob(
    string RepositoryFullName,
    int PullRequestNumber,
    string HeadSha);

/// <summary>
/// In-memory queue with de-duplication: the same PR cannot be enqueued again until <see cref="Complete"/>.
/// </summary>
public sealed class InMemoryPullReviewJobQueue
{
    private readonly Queue<PullReviewJob> _ready = new();
    private readonly HashSet<PullReviewQueueKey> _inFlight = [];

    public bool TryEnqueue(PullReviewJob job)
    {
        var key = new PullReviewQueueKey(job.RepositoryFullName, job.PullRequestNumber);
        if (!_inFlight.Add(key))
            return false;

        _ready.Enqueue(job);
        return true;
    }

    public bool TryDequeue(out PullReviewJob? job) => _ready.TryDequeue(out job);

    public void Complete(PullReviewJob job)
    {
        _inFlight.Remove(new PullReviewQueueKey(job.RepositoryFullName, job.PullRequestNumber));
    }

    public int PendingCount => _ready.Count;
}
