import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
}
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // Feature flag: если auth отключен, используем дефолтного пользователя
  if (process.env.ENABLE_AUTH !== 'true') {
    req.userId = 'default-user-id';
    return next();
  }

  // Извлекаем токен из заголовка Authorization
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new AppError(401, 'Authentication required', true);
  }

  try {
    // Проверяем и декодируем токен
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid or expired token', true);
  }
};
