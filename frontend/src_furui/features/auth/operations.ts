import { AppThunk } from "../src_furui/store/helpers";
import { ConfigurableProfile } from "../src_furui/user";

export const signup = (signupInput: ConfigurableProfile): AppThunk => async (
  _dispatch,
  _,
  { api }
) => {
  await api.signup({
    ...signupInput,
    university: {
      name: signupInput.univName,
      department: signupInput.department,
      subject: signupInput.subject,
    },
  });
};

export const verifyEmail = (token: string): AppThunk => async (
  _dispatch,
  _,
  { api }
) => {
  await api.verifyEmail(token);
};

export const login = (): AppThunk<{ redirectUrl: string }> => async (
  _dispatch,
  _,
  { api }
) => {
  return await api.login();
};

export const processCallback = (
  code: string,
  state: string
): AppThunk => async (_dispatch, _, { api }) => {
  await api.processCallback(code, state);
};

export const logout = (): AppThunk => async (_dispatch, _, { api }) => {
  await api.logout();
};
