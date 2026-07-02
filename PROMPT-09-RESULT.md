# PROMPT-09 Result

## Endpoint

- `GET https://mibital.com/customer-subscriptions/public/plans?business_id=9`
- The register page filters the response by `PUBLIC_PREMIUM_PLAN_ID`.
- The request is server-side and sends `X-Business-Key` from `BUSINESS_API_KEY`.
- Live check returned plan `2` as `Plan Premium` with `price_usd=18` and `price_dop=0`, so the form displays `USD $18/mes`.

## Diff Summary

- Added `src/lib/registerPlan.ts` to fetch the public plans server-side for HCI business `9`.
- Added `src/lib/registerPlanDisplay.ts` to normalize the display label with USD priority, then DOP fallback.
- Updated `src/pages/register.astro` to pass the premium plan summary into the React island.
- Updated `src/components/RegisterForm.tsx` to render the API-derived price label, or the plan name without amount when no price is available.
- Added `tests/registerPlanDisplay.test.ts` for USD priority, DOP fallback, and no-amount fallback.
- Added dev dependencies `@astrojs/check` and `typescript` because `astro check` required them.

## Evidence

- RED first: a guard command checking for the old hardcoded DOP monthly amount in `src/components/RegisterForm.tsx` failed before the fix.
- `bun install`: OK, no changes before adding check dependencies.
- `bun run astro check`: OK after installing `@astrojs/check` and `typescript`; existing hints only.
- `PUBLIC_PREMIUM_PLAN_ID=2 SERVER_URL=http://127.0.0.1:3000/ BUSINESS_API_KEY=test_key SECRET_KEY=test_secret REDIS_URL=redis://127.0.0.1:6379 NODE_ENV=development bun run build`: OK.
- `bun tests/registerPlanDisplay.test.ts`: OK.
- Live endpoint check: `plan 2 -> price_usd=18`, `price_dop=0`.
- Dev self-check with real API: `/register` rendered `USD $18/mes`.
- Dev fallback self-check with backend stub stopped: `/register` rendered `Plan Premium` and no amount.
