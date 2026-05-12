using System.Text;
using Npgsql;
using RabbitMQ.Client;
using Testcontainers.PostgreSql;
using Testcontainers.RabbitMq;

namespace Codist.QA.Backend.IntegrationTests;

public sealed class RabbitMqAndPostgreSqlTests : IAsyncLifetime
{
    private PostgreSqlContainer? _postgres;
    private RabbitMqContainer? _rabbit;

    public async Task InitializeAsync()
    {
        _postgres = new PostgreSqlBuilder().Build();
        _rabbit = new RabbitMqBuilder().Build();
        await Task.WhenAll(_postgres.StartAsync(), _rabbit.StartAsync());
    }

    public async Task DisposeAsync()
    {
        if (_postgres is not null)
            await _postgres.DisposeAsync();
        if (_rabbit is not null)
            await _rabbit.DisposeAsync();
    }

    [Fact]
    public async Task Postgres_accepts_sql()
    {
        Assert.NotNull(_postgres);
        await using var conn = new NpgsqlConnection(_postgres.GetConnectionString());
        await conn.OpenAsync();
        await using var cmd = new NpgsqlCommand("SELECT 1", conn);
        var scalar = await cmd.ExecuteScalarAsync();
        Assert.Equal(1, Convert.ToInt32(scalar));
    }

    [Fact]
    public void RabbitMQ_round_trips_message()
    {
        Assert.NotNull(_rabbit);
        var factory = new ConnectionFactory { Uri = new Uri(_rabbit.GetConnectionString()) };
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();
        const string q = "codist-qa";
        channel.QueueDeclare(q, durable: false, exclusive: false, autoDelete: true);
        var body = Encoding.UTF8.GetBytes("engineiq");
        channel.BasicPublish("", q, body: body);
        var result = channel.BasicGet(q, autoAck: true);
        Assert.NotNull(result);
        Assert.Equal("engineiq", Encoding.UTF8.GetString(result.Body.Span));
    }
}
