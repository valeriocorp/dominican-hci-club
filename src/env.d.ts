/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

//? Convertir a módulo para que declare global funcione
export {};

interface ImportMetaEnv {
  readonly SERVER_URL: string;
  readonly SECRET_KEY: string;
  readonly BUSINESS_API_KEY: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
  /**
   * Usuario del backend larimar (modelo users sin password)
   * Respuesta de /auth/customer/login y /auth/customer/register
   */
  interface CustomerUser {
    id: string;
    name: string;
    email: string;
    lastname?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    user_type: string; // "customer"
    is_active?: boolean | null;
    email_verified?: boolean | null;
    phone_verified?: boolean | null;
    created_at?: string | null;
    last_login?: string | null;
    mfa_enabled: boolean;
    mfa_preferred_method?: string | null;
    preferences?: Record<string, unknown> | null;
    account_locked?: boolean | null;
    role_id?: string | null;
  }

  /**
   * Negocio asociado al customer
   */
  interface CustomerBusiness {
    id: string;
    name: string;
  }

  /**
   * Suscripción del customer
   */
  interface CustomerSubscription {
    id: string;
    plan_id: string;
    plan_name: string;
    plan_type: 'free' | 'premium';
    status: string;
    amount: string;
    currency: string;
  }

  /**
   * Respuesta de autenticación del backend
   * POST /auth/customer/login
   * POST /auth/customer/register
   */
  interface CustomerAuthResponse {
    user: CustomerUser;
    token: string;
    businesses: CustomerBusiness[];
    subscription?: CustomerSubscription | null;
  }

  /**
   * Respuesta de check email
   * POST /auth/customer/check-email
   */
  interface CheckEmailResponse {
    exists: boolean;
    businesses?: CustomerBusiness[];
  }

  /**
   * Datos almacenados en la sesión de Astro
   */
  interface SessionData {
    user: CustomerUser;
    token: string;
    businesses: CustomerBusiness[];
    subscription?: CustomerSubscription | null;
    currentBusinessId?: string;
    time_since_last_session_check?: number;
  }

  /**
   * Datos disponibles en Astro.locals (middleware)
   */
  interface Locals {
    isLoggedIn: boolean;
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    token: string | null;
    currentBusinessId: string | null;
    subscription: CustomerSubscription | null;
  }
  }
}
