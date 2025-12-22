// utils/api/buildApiUrl.ts

// Estos siempre se van a incluir si existen en la URL
const PAGINATION_PARAMS = ["cursor", "direction", "take"];

/**
 * @param request Objeto Request de Remix
 * @param apiEndpoint Path de la API (ej: "/api/work-entries")
 * @param filterParams Array de strings con los filtros específicos de la vista
 */
export function buildApiUrl(
  request: Request, 
  apiEndpoint: string, 
  filterParams: string[] = []
) {
  const url = new URL(request.url);
  const apiUrl = new URL(`${process.env.APP_URL}${apiEndpoint}`);
  
  // Unimos los de paginación con los filtros específicos
  const allowedParams = [...PAGINATION_PARAMS, ...filterParams];

  allowedParams.forEach(param => {
    const value = url.searchParams.get(param);
    // Solo seteamos si el valor no es nulo o vacío
    if (value) {
      apiUrl.searchParams.set(param, value);
    }
  });

  return apiUrl.toString();
}