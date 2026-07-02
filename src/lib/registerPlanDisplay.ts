export interface CustomerSubscriptionPlan {
  id: string | number
  name?: string | null
  price_dop?: number | string | null
  price_usd?: number | string | null
}

export interface RegisterPlanSummary {
  name: string
  priceLabel: string | null
}

export const DEFAULT_REGISTER_PLAN_NAME = "Plan Premium"

export function toRegisterPlanSummary(
  plan?: CustomerSubscriptionPlan | null,
): RegisterPlanSummary {
  const name = normalizePlanName(plan?.name)

  return {
    name,
    priceLabel: plan ? getPlanPriceLabel(plan) : null,
  }
}

export function getPlanPriceLabel(plan: Pick<CustomerSubscriptionPlan, "price_dop" | "price_usd">): string | null {
  const usdPrice = normalizePrice(plan.price_usd)
  if (usdPrice > 0) {
    return formatMonthlyPrice("USD", usdPrice)
  }

  const dopPrice = normalizePrice(plan.price_dop)
  if (dopPrice > 0) {
    return formatMonthlyPrice("DOP", dopPrice)
  }

  return null
}

function normalizePlanName(name: CustomerSubscriptionPlan["name"]): string {
  if (typeof name === "string" && name.trim()) {
    return name.trim()
  }

  return DEFAULT_REGISTER_PLAN_NAME
}

function normalizePrice(value: CustomerSubscriptionPlan["price_dop"]): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function formatMonthlyPrice(currency: "DOP" | "USD", amount: number): string {
  const hasCents = !Number.isInteger(amount)
  const formattedAmount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount)

  return `${currency} $${formattedAmount}/mes`
}
