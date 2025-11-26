import { ActionError } from 'astro:actions';
import { 
    getErrorMessage, 
    type BackendErrorResponse 
} from '../types/ErrorCodes';

export type ActionErrorCode = 
    | "BAD_REQUEST" 
    | "UNAUTHORIZED" 
    | "FORBIDDEN" 
    | "NOT_FOUND" 
    | "CONFLICT" 
    | "INTERNAL_SERVER_ERROR" 
    | "SERVICE_UNAVAILABLE" 
    | "GATEWAY_TIMEOUT";

/**
 * Maneja errores del backend de manera consistente
 * @param response - Response del fetch
 * @param data - Datos del response parseados como JSON
 * @throws ActionError con el mensaje y código apropiados
 */
export function handleBackendError(response: Response, data: BackendErrorResponse): never {
    let errorMessage: string;
    let actionErrorCode: ActionErrorCode;

    // Si tenemos un código de error estructurado del backend
    if (data.errorCode) {
        errorMessage = getErrorMessage(data.errorCode);
        
        // Mapear códigos de estado HTTP a tipos de ActionError apropiados
        actionErrorCode = mapHttpStatusToActionError(response.status);
    } else {
        // Fallback para errores sin código estructurado
        const message = Array.isArray(data.message) 
            ? data.message.join('. ') 
            : data.message;
        errorMessage = message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
        actionErrorCode = response.status >= 500 ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST";
    }

    throw new ActionError({
        code: actionErrorCode,
        message: errorMessage,
    });
}

/**
 * Mapea códigos de estado HTTP a códigos de ActionError
 * @param statusCode - Código de estado HTTP
 * @returns Código de ActionError apropiado
 */
export function mapHttpStatusToActionError(statusCode: number): ActionErrorCode {
    switch (true) {
        case statusCode === 400:
            return "BAD_REQUEST";
        case statusCode === 401:
            return "UNAUTHORIZED";
        case statusCode === 403:
            return "FORBIDDEN";
        case statusCode === 404:
            return "NOT_FOUND";
        case statusCode === 409:
            return "CONFLICT";
        case statusCode === 503:
            return "SERVICE_UNAVAILABLE";
        case statusCode === 504:
            return "GATEWAY_TIMEOUT";
        case statusCode >= 500:
            return "INTERNAL_SERVER_ERROR";
        default:
            return "BAD_REQUEST";
    }
}

/**
 * Maneja una respuesta exitosa del backend
 * @param response - Response del fetch
 * @param data - Datos del response
 * @param successMessage - Mensaje de éxito personalizado (opcional)
 * @returns Objeto de respuesta exitosa
 */
export function handleSuccessResponse<T = unknown>(
    response: Response, 
    data: T, 
    successMessage?: string
): { success: true; message: string; data?: T } {
    return {
        success: true,
        message: successMessage || "Operación completada exitosamente.",
        data: data
    };
}

/**
 * Función principal para manejar respuestas del backend
 * @param response - Response del fetch
 * @param successMessage - Mensaje personalizado para casos exitosos
 * @returns Resultado exitoso o lanza ActionError
 */
export async function handleBackendResponse<T = unknown>(
    response: Response, 
    successMessage?: string
): Promise<{ success: true; message: string; data?: T }> {
    const data = await response.json();
    
    // Logging para desarrollo
    if (import.meta.env.DEV) {
        console.log('Backend Response Status:', response.status);
        console.log('Backend Response Data:', JSON.stringify(data, null, 2));
    }

    // Casos exitosos (2xx)
    if (response.ok) {
        return handleSuccessResponse(response, data as T, successMessage);
    }

    // Casos de error
    handleBackendError(response, data as BackendErrorResponse);
}

/**
 * Crea un ActionError genérico para casos no contemplados
 * @param message - Mensaje de error personalizado (opcional)
 * @returns ActionError configurado
 */
export function createGenericError(message?: string): ActionError {
    return new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: message || 'Ocurrió un error inesperado al procesar tu solicitud.',
    });
}
