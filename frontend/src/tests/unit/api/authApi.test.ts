import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authApi } from '../../../api/authApi';
import { apiClient } from '../../../api/client';

// Мокируем apiClient
vi.mock('../../../api/client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('должен отправить POST запрос на /auth/register с корректными данными', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
          },
          token: 'jwt-token-123',
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.post as any).mockResolvedValue(mockResponse);

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await authApi.register(userData);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
    });

    it('должен бросить ошибку при регистрации с существующим email', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'User already exists' },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.post as any).mockRejectedValue(mockError);

      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };

      try {
        await authApi.register(userData);
        expect.fail('Должна была выброситься ошибка');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe('User already exists');
      }
    });
  });

  describe('login', () => {
    it('должен отправить POST запрос на /auth/login с email и password', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
          },
          token: 'jwt-token-123',
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.post as any).mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authApi.login(credentials);

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    });

    it('должен бросить ошибку при неверных учетных данных', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.post as any).mockRejectedValue(mockError);

      try {
        await authApi.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
        expect.fail('Должна была выброситься ошибка');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('getMe', () => {
    it('должен отправить GET запрос на /auth/me', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.get as any).mockResolvedValue(mockResponse);

      const result = await authApi.getMe();

      expect(result).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('должен бросить ошибку 401 если токен невалиден', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Authentication required' },
        },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (apiClient.get as any).mockRejectedValue(mockError);

      try {
        await authApi.getMe();
        expect.fail('Должна была выброситься ошибка');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });
});
