import type { APIContext } from 'astro';
import type { User, Business, CustomerSubscription } from '@/types/ApiResponse';

/**
 * Tipo de sesión de Astro extraído del APIContext
 */
type AstroSession = APIContext['session'];

/**
 * Datos almacenados en la sesión
 */
interface SessionData {
  user: User;
  token: string;
  businesses: Business[];
  subscription?: CustomerSubscription | null;
  currentBusinessId?: string;
  time_since_last_session_check?: number;
}

/**
 * Obtiene el usuario de la sesión
 * @param session - Instancia de la sesión de Astro
 * @returns El usuario autenticado o null si no existe
 */
export async function getSessionUser(
  session: AstroSession
): Promise<User | null> {
  if (!session) return null;
  return (await session.get('user')) ?? null;
}

/**
 * Obtiene el token JWT de la sesión
 * @param session - Instancia de la sesión de Astro
 * @returns El token JWT o null si no existe
 */
export async function getSessionToken(
  session: AstroSession
): Promise<string | null> {
  if (!session) return null;
  return (await session.get('token')) ?? null;
}

/**
 * Obtiene la lista de negocios del customer desde la sesión
 * @param session - Instancia de la sesión de Astro
 * @returns Array de negocios o null si no existe
 */
export async function getSessionBusinesses(
  session: AstroSession
): Promise<Business[] | null> {
  if (!session) return null;
  return (await session.get('businesses')) ?? null;
}

/**
 * Obtiene la suscripción del customer desde la sesión
 * @param session - Instancia de la sesión de Astro
 * @returns Suscripción o null si no existe
 */
export async function getSessionSubscription(
  session: AstroSession
): Promise<CustomerSubscription | null> {
  if (!session) return null;
  return (await session.get('subscription')) ?? null;
}

/**
 * Determina si una suscripción representa una membresía premium activa y pagada.
 *
 * Fuente única de verdad para el control de acceso: el backend (larimar) solo
 * devuelve suscripciones con `status: 'active'` en login/me, por lo que una
 * suscripción ausente (null) significa "sin membresía". El plan gratuito quedó
 * despublicado, así que solo `plan_type: 'premium'` habilita acceso de miembro.
 *
 * @param subscription - Suscripción de la sesión (o null)
 * @returns true solo si hay una membresía premium activa
 */
export function hasActiveMembership(
  subscription?: CustomerSubscription | null
): boolean {
  return (
    !!subscription &&
    subscription.plan_type === 'premium' &&
    subscription.status === 'active'
  );
}

/**
 * Obtiene el ID del negocio actualmente seleccionado
 * @param session - Instancia de la sesión de Astro
 * @returns ID del negocio actual o null si no está seleccionado
 */
export async function getCurrentBusinessId(
  session: AstroSession
): Promise<string | null> {
  if (!session) return null;
  return (await session.get('currentBusinessId')) ?? null;
}

/**
 * Verifica si la sesión es válida (tiene un usuario autenticado)
 * @param session - Instancia de la sesión de Astro
 * @returns true si la sesión tiene un usuario válido
 */
export async function isSessionValid(
  session: AstroSession
): Promise<boolean> {
  if (!session) return false;
  const user = await session.get('user');
  return user !== undefined && user !== null;
}

/**
 * Obtiene el timestamp de la última verificación de sesión
 * @param session - Instancia de la sesión de Astro
 * @returns Timestamp en milisegundos o 0 si no existe
 */
export async function getLastSessionCheck(
  session: AstroSession
): Promise<number> {
  if (!session) return 0;
  return (await session.get('time_since_last_session_check')) ?? 0;
}

/**
 * Actualiza el timestamp de la última verificación de sesión
 * Útil para implementar cache de verificaciones en el middleware
 * @param session - Instancia de la sesión de Astro
 */
export function updateSessionCheckTimestamp(
  session: AstroSession
): void {
  if (!session) return;
  session.set('time_since_last_session_check', Date.now());
}

/**
 * Establece múltiples valores en la sesión de una vez
 * Útil para inicializar sesión después de login/register
 * @param session - Instancia de la sesión de Astro
 * @param data - Objeto con las propiedades de SessionData a establecer
 */
export function setSessionData(
  session: AstroSession,
  data: Partial<SessionData>
): void {
  if (!session) return;

  if (data.user !== undefined) {
    session.set('user', data.user);
  }
  if (data.token !== undefined) {
    session.set('token', data.token);
  }
  if (data.businesses !== undefined) {
    session.set('businesses', data.businesses);
  }
  if (data.subscription !== undefined) {
    session.set('subscription', data.subscription);
  }
  if (data.currentBusinessId !== undefined) {
    session.set('currentBusinessId', data.currentBusinessId);
  }
  if (data.time_since_last_session_check !== undefined) {
    session.set('time_since_last_session_check', data.time_since_last_session_check);
  }
}

/**
 * Destruye la sesión completamente
 * @param session - Instancia de la sesión de Astro
 */
export function clearSession(
  session: AstroSession
): void {
  if (!session) return;
  session.destroy();
}

/**
 * Obtiene todos los datos de la sesión en un solo objeto
 * @param session - Instancia de la sesión de Astro
 * @returns Objeto con todas las propiedades de sesión disponibles
 */
export async function getFullSessionData(
  session: AstroSession
): Promise<Partial<SessionData>> {
  if (!session) return {};

  const [user, token, businesses, subscription, currentBusinessId, time_since_last_session_check] =
    await Promise.all([
      session.get('user'),
      session.get('token'),
      session.get('businesses'),
      session.get('subscription'),
      session.get('currentBusinessId'),
      session.get('time_since_last_session_check'),
    ]);

  const result: Partial<SessionData> = {};

  if (user !== undefined) result.user = user;
  if (token !== undefined) result.token = token;
  if (businesses !== undefined) result.businesses = businesses;
  if (subscription !== undefined) result.subscription = subscription;
  if (currentBusinessId !== undefined) result.currentBusinessId = currentBusinessId;
  if (time_since_last_session_check !== undefined) {
    result.time_since_last_session_check = time_since_last_session_check;
  }

  return result;
}
