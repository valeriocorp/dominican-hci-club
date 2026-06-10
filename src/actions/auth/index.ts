import { registerCustomer } from "./register-customer";
import { loginCustomer } from "./login-customer";
import { logout } from "./logout";
import { sessionStatus } from "./session-status";
import { refreshUserData } from "./refresh-user-data";
import { getLoginMethods } from "./get-login-methods";
import { sendMagicLink } from "./send-magic-link";
import { verifyMagicLink } from "./verify-magic-link";
import { sendWhatsappOtp } from "./send-whatsapp-otp";
import { verifyWhatsappOtp } from "./verify-whatsapp-otp";

export const auth = {
    registerCustomer,
    loginCustomer,
    logout,
    sessionStatus,
    refreshUserData,
    getLoginMethods,
    sendMagicLink,
    verifyMagicLink,
    sendWhatsappOtp,
    verifyWhatsappOtp,
};
