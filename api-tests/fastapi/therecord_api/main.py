from fastapi import FastAPI

app = FastAPI(title="The Record API (test scaffold)")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
