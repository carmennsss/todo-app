import type { HttpInterceptorFn } from '@angular/common/http';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/api') && req.url.indexOf('auth') === -1) {
    const token = JSON.parse(localStorage.getItem('token') || '{}');
    if (token) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
    }
  }
  return next(req);
};
