namespace Codist.QA.Backend.WorkerTests;

public sealed record PullReviewJob(string RepositoryFullName, int PullRequestNumber, string HeadSha);

public interface IMessageLifecycle
{
    Task AckAsync(CancellationToken cancellationToken = default);
    Task NackAsync(bool requeue, CancellationToken cancellationToken = default);
}

public sealed class PullReviewJobConsumer(Func<PullReviewJob, CancellationToken, Task> onJob)
{
    public async Task HandleAsync(
        PullReviewJob job,
        IMessageLifecycle lifecycle,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await onJob(job, cancellationToken).ConfigureAwait(false);
            await lifecycle.AckAsync(cancellationToken).ConfigureAwait(false);
        }
        catch
        {
            await lifecycle.NackAsync(requeue: true, cancellationToken).ConfigureAwait(false);
            throw;
        }
    }
}
