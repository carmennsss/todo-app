import type { HttpInterceptorFn } from '@angular/common/http';

/**
 * This interceptor adds the authorization header to all requests that are made to the API.
 * It checks if the request URL includes '/api' and does not include 'auth'.
 * If the token is present in local storage, it adds the token to the request headers.
 * @param req 
 * @param next 
 * @returns 
 */
export const userInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api') && !req.url.includes('auth')) {
    const token = localStorage.getItem('token')?.replaceAll('"', '');
    if (token) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`,
        }
      });
    }
  }
  return next(req);
};
