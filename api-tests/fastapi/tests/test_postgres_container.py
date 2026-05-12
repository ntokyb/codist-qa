"""PostgreSQL via Testcontainers — swap / extend when wiring real repositories."""

import psycopg2
import pytest
from testcontainers.postgres import PostgresContainer


@pytest.fixture(scope="module")
def postgres() -> PostgresContainer:
    with PostgresContainer("postgres:16-alpine") as pg:
        yield pg


def test_postgres_accepts_sql(postgres: PostgresContainer) -> None:
    url = postgres.get_connection_url()
    conn = psycopg2.connect(url)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            assert cur.fetchone()[0] == 1
    finally:
        conn.close()
