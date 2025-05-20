import type { HttpInterceptorFn } from '@angular/common/http';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api') && !req.url.includes('auth')) {
    const token = localStorage.getItem('token')?.replaceAll('"', '');
    if (token) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`,
        }
      });
      console.log(req.headers.get('authorization'));
    }
  }
  return next(req);
};
