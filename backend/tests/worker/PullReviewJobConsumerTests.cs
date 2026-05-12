using Moq;

namespace Codist.QA.Backend.WorkerTests;

public sealed class PullReviewJobConsumerTests
{
    [Fact]
    public async Task Acknowledges_when_handler_succeeds()
    {
        var job = new PullReviewJob("acme/api", 99, "abc123");
        var lifecycle = new Mock<IMessageLifecycle>(MockBehavior.Strict);
        lifecycle.Setup(l => l.AckAsync(It.IsAny<CancellationToken>())).Returns(Task.CompletedTask);

        var consumer = new PullReviewJobConsumer((j, _) =>
        {
            Assert.Equal(job, j);
            return Task.CompletedTask;
        });

        await consumer.HandleAsync(job, lifecycle.Object);

        lifecycle.Verify(l => l.AckAsync(It.IsAny<CancellationToken>()), Times.Once);
        lifecycle.Verify(l => l.NackAsync(It.IsAny<bool>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Nacks_with_requeue_when_handler_throws()
    {
        var job = new PullReviewJob("acme/api", 1, "deadbeef");
        var lifecycle = new Mock<IMessageLifecycle>(MockBehavior.Strict);
        lifecycle
            .Setup(l => l.NackAsync(true, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var consumer = new PullReviewJobConsumer((_, _) => Task.FromException(new InvalidOperationException("clone failed")));

        await Assert.ThrowsAsync<InvalidOperationException>(() => consumer.HandleAsync(job, lifecycle.Object));

        lifecycle.Verify(l => l.NackAsync(true, It.IsAny<CancellationToken>()), Times.Once);
        lifecycle.Verify(l => l.AckAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
