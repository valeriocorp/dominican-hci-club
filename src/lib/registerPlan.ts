import { BUSINESS_API_KEY, SERVER_URL } from "astro:env/server"
import {
  type CustomerSubscriptionPlan,
  type RegisterPlanSummary,
  toRegisterPlanSummary,
} from "./registerPlanDisplay"

const HCI_BUSINESS_ID = "9"

interface PublicPlansResponse {
  success?: boolean
  data?: CustomerSubscriptionPlan[]
}

export async function getPremiumRegisterPlan(planId: string): Promise<RegisterPlanSummary> {
  try {
    const url = new URL("customer-subscriptions/public/plans", SERVER_URL)
    url.searchParams.set("business_id", HCI_BUSINESS_ID)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Business-Key": BUSINESS_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Public plans request failed with ${response.status}`)
    }

    const result = (await response.json()) as PublicPlansResponse
    const plans = Array.isArray(result.data) ? result.data : []
    const plan = plans.find((candidate) => String(candidate.id) === planId)

    return toRegisterPlanSummary(plan)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error loading premium register plan:", error)
    }

    return toRegisterPlanSummary(null)
  }
}
