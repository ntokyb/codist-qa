# Maemo Compliance E2E Tests

## Smoke tests (no auth required)

```bash
npx playwright test --project=maemo-compliance --grep @smoke
```

API smoke (separate project / base URL):

```bash
npx playwright test --project=maemo-compliance-api --grep @smoke
```

## Auth tests (Azure AD credentials required)

```bash
MAEMO_TEST_EMAIL=admin@maemo-compliance.co.za \
MAEMO_TEST_PASSWORD=xxx \
npx playwright test --project=maemo-compliance --grep @auth
```

## Environment variables

| Variable | Meaning |
|----------|---------|
| `MAEMO_URL` | Frontend URL (default: https://maemo-compliance.co.za) |
| `MAEMO_API_URL` | API URL (default: https://api.maemo-compliance.co.za) |
| `MAEMO_TEST_EMAIL` | Azure AD test user email |
| `MAEMO_TEST_PASSWORD` | Azure AD test user password |
