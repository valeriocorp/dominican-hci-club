import { sendTestEmail } from "./send-test-email";
import { sendWelcomeBasicEmail } from "./send-welcome-basic-email";
import { sendWelcomePremiumEmail } from "./send-welcome-premium-email";
import { sendCancellationEmail } from "./send-cancellation-email";
import { sendPaymentConfirmationEmail } from "./send-payment-confirmation-email";
import { sendPaymentFailedEmail } from "./send-payment-failed-email";

export const email = {
    sendTestEmail,
    sendWelcomeBasicEmail,
    sendWelcomePremiumEmail,
    sendCancellationEmail,
    sendPaymentConfirmationEmail,
    sendPaymentFailedEmail,
};

// Re-exportar funciones internas para uso en otras actions y endpoints API
export { sendWelcomeBasicEmailInternal } from "./send-welcome-basic-email";
export { sendWelcomePremiumEmailInternal } from "./send-welcome-premium-email";
export { sendCancellationEmailInternal } from "./send-cancellation-email";
export { sendPaymentConfirmationEmailInternal } from "./send-payment-confirmation-email";
export { sendPaymentFailedEmailInternal } from "./send-payment-failed-email";

