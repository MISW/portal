import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { verifyEmail as verifyEmailRequest, login as loginRequest, logout as logoutRequest, processCallback } from './operations';

export const useVerifyEmail = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'pending' | 'fulfilled' | 'rejected'>();
  const [error, setError] = useState<unknown>();
  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        setStatus('pending');
        await dispatch(verifyEmailRequest(token));
        setStatus('fulfilled');
      } catch (e) {
        setError(e);
        setStatus('rejected');
      }
    },
    [dispatch],
  );
  return {
    status,
    error,
    verifyEmail,
  } as const;
};

export const useLogin = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<unknown>();
  const login = useCallback(async () => {
    try {
      const { redirectUrl } = await dispatch(loginRequest());
      location.href = redirectUrl;
    } catch (e) {
      setError(e);
    }
  }, [dispatch]);
  return {
    error,
    login,
  } as const;
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<unknown>();
  const handleLogout = useCallback(async () => {
    try {
      const { logoutUrl } = await dispatch(logoutRequest());
      location.href = logoutUrl;
    } catch (e) {
      setError(e);
    }
  }, [dispatch]);
  return {
    error,
    handleLogout,
  } as const;
};

export const useAuthCallback = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<unknown>();
  const handleCallback = useCallback(
    async (code: string, state: string) => {
      try {
        await dispatch(processCallback(code, state));
        await router.push('/');
      } catch (e) {
        setError(e);
      }
    },
    [dispatch, router],
  );
  return {
    error,
    handleCallback,
  } as const;
};
