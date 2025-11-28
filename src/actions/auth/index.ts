import { registerCustomer } from "./register-customer";
import { loginCustomer } from "./login-customer";
import { logout } from "./logout";
import { sessionStatus } from "./session-status";
import { refreshUserData } from "./refresh-user-data";

export const auth = {
    registerCustomer,
    loginCustomer,
    logout,
    sessionStatus,
    refreshUserData,
};
