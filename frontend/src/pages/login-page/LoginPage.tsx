import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { type Login, LoginSchema } from './login.schema';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: Login) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('root', { message: 'Login or password is incorrect' });
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Войти</h2>

      {errors.root && (
        <div
          style={{
            color: '#EF4444',
            backgroundColor: '#FEE2E2',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #FCA5A5',
          }}
        >
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '5px',
              fontWeight: '500',
            }}
          >
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px',
              border: errors.email ? '1px solid #EF4444' : '1px solid #D1D5DB',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {errors.email && (
            <p
              style={{
                color: '#EF4444',
                fontSize: '12px',
                marginTop: '5px',
                marginBottom: '0',
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            {...register('password')}
            type="password"
            placeholder="your password"
            style={{
              width: '100%',
              padding: '10px',
              paddingRight: '40px',
              border: errors.password
                ? '1px solid #EF4444'
                : '1px solid #D1D5DB',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {errors.password && (
            <p
              style={{
                color: '#EF4444',
                fontSize: '12px',
                marginTop: '5px',
                marginBottom: '0',
              }}
            >
              {errors.password?.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#9CA3AF' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {isSubmitting ? 'Loading...' : 'Login'}
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        Еще нет аккаунта?{' '}
        <Link
          to="/register"
          style={{
            color: '#3B82F6',
            textDecoration: 'underline',
            fontWeight: '500',
          }}
        >
          Зарегистрируйтесь
        </Link>
      </p>

      {!import.meta.env.VITE_ENABLE_AUTH && (
        <p
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: '5px',
            fontSize: '12px',
            color: '#92400E',
          }}
        >
          ℹ️ Demo mode: Authentication is disabled. You can access the app
          directly.
        </p>
      )}
    </div>
  );
};
