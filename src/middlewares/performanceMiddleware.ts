import { Request, Response, NextFunction } from 'express';

export function performanceMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    if (duration > 300) {
      console.warn(`[PERFORMANCE WARNING] La ruta ${req.method} ${req.originalUrl} tardó ${duration}ms (Límite: 300ms)`);
    }
  });

  next();
}