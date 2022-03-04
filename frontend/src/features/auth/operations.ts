import { SignupInput } from 'models/user';
import { AppThunk } from 'store/helpers';

export const signup =
  (signupInput: SignupInput): AppThunk =>
  async (_dispatch, _, { api }) => {
    await api.signup(signupInput);
  };

export const verifyEmail =
  (token: string): AppThunk =>
  async (_dispatch, _, { api }) => {
    await api.verifyEmail(token);
  };

export const login =
  (): AppThunk<{
    redirectUrl: string;
  }> =>
  async (_dispatch, _, { api }) => {
    return await api.login();
  };

export const processCallback =
  (code: string, state: string): AppThunk =>
  async (_dispatch, _, { api }) => {
    await api.processCallback(code, state);
  };

export const logout =
  (): AppThunk =>
  async (_dispatch, _, { api }) => {
    await api.logout();
  };
