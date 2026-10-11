import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    });
    return;
  }

  // Don't leak internals in production
  const isDev = process.env.NODE_ENV === 'development';
  console.error('[error]', err);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev && err instanceof Error ? err.message : 'Something went wrong.',
    },
  });
}
