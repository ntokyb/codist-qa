# Codist QA

Cross-product smoke and E2E tests for all Codist products.

## Products covered

| Product | URL | Smoke tests |
|---------|-----|-------------|
| Billable | https://mybillable.co.za | Yes |
| EngineIQ | https://engineiq.co.za | Yes |
| The Record | https://therecord.co.za | Yes |
| Maemo Compliance | https://maemo-compliance.co.za | Yes |
| War Room | https://warroom.codist.co.za | Yes |

## Run all smoke tests

```bash
npm install
npx playwright install chromium
npx playwright test --grep @smoke
```

## GitHub Actions secrets required

`BILLABLE_URL`, `ENGINEIQ_URL`, `THERECORD_URL`, `MAEMO_COMPLIANCE_URL`, `MAEMO_COMPLIANCE_API_URL`, `WARROOM_URL`
