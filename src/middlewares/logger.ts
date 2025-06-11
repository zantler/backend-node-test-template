import { Request, Response, NextFunction } from "express";

/**
 * Middleware for logging request information
 *
 * TODO: Implement this middleware to:
 * 1. Log request method and URL
 * 2. Log query parameters if they exist
 * 3. Track request duration
 * 4. Log response status code and duration when the request completes
 */
const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Implement the logging middleware
  const startTime = Date.now();

  // Log método y URL
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

  // Log de parámetros de query si existen
  if (Object.keys(req.query).length > 0) {
    console.log(`Query params: ${JSON.stringify(req.query)}`);
  }

  // Cuando la respuesta termina
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`Response status: ${res.statusCode} - Duration: ${duration}ms`);
  });

  next();
};

export { requestLogger };
