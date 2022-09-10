import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { verifyEmail as verifyEmailRequest, login as loginRequest, logout as logoutRequest, logoutFromOIDC as logoutFromOIDCRequest, processCallback } from './operations';

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

//みすポータルからログアウトする
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

//OpenIDConnectで使ってるアカウントからログアウトする
export const useLogoutFromOIDC = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<unknown>();
  const handleLogout = useCallback(async () => {
    try {
      const { logoutUrl } = await dispatch(logoutFromOIDCRequest());
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


/*
 ログインのcallbackを取り扱う
 ログインに成功した場合: 
  - みすポータルにアカウントを既に持っている場合: `/`へリダイレクト
  - みすポータルにアカウントをまだ持っていない場合: `/signup`へリダイレクト
*/
export const useAuthCallback = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState<unknown>();
  const handleCallback = useCallback(
    async (code: string, state: string) => {
      try {
        const {hasAccount} = await dispatch(processCallback(code, state));
        if(hasAccount){
          await router.push('/');
        }else{
          await router.push('/signup');
        }
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
