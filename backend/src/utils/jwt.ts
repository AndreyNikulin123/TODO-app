import jwt, { SignOptions } from 'jsonwebtoken';
import { StringValue } from 'ms';

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as StringValue,
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET!, options);
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
};
