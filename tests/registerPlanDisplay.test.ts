import { DEFAULT_REGISTER_PLAN_NAME, getPlanPriceLabel, toRegisterPlanSummary } from "../src/lib/registerPlanDisplay"

function assertEqual(actual: unknown, expected: unknown, label: string) {
  const actualJson = JSON.stringify(actual)
  const expectedJson = JSON.stringify(expected)

  if (actualJson !== expectedJson) {
    throw new Error(`${label}: expected ${expectedJson}, received ${actualJson}`)
  }
}

assertEqual(
  getPlanPriceLabel({ price_usd: 18, price_dop: 1250 }),
  "USD $18/mes",
  "prefers USD when the plan has a USD price",
)

assertEqual(
  getPlanPriceLabel({ price_usd: 0, price_dop: 1800 }),
  "DOP $1,800/mes",
  "uses DOP when there is no USD price",
)

assertEqual(
  toRegisterPlanSummary({ id: "2", name: "Plan Premium", price_usd: 0, price_dop: 0 }),
  {
    name: "Plan Premium",
    priceLabel: null,
  },
  "shows the plan name without amount when there is no usable price",
)

assertEqual(
  toRegisterPlanSummary(null),
  {
    name: DEFAULT_REGISTER_PLAN_NAME,
    priceLabel: null,
  },
  "uses the default plan name when the fetch fallback has no plan data",
)

console.log("register plan display tests passed")
