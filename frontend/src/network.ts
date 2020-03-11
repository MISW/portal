import { User, UserForSignUp } from './user';

const getHostAPI = () => `${location.protocol}//${location.host}/api`;

export const login = async () => {
  const res = await fetch(`${getHostAPI()}/public/login`, {
    headers: {
      'Accept': 'applicaton/json, */*',
      'Content-type': 'application/json'
    },
    method: 'POST'
  });
  if (res.status >= 400) {
    return Promise.reject(`Failed to login. Response=${res}`);
  }
  const body = await res.json();
  location.href = body.redirect_url;
};

export const getProfile = async (): Promise<User> => {
  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      'Accept': 'applicaton/json, */*',
    },
    credentials: 'include',
    method: 'GET'
  });
  if (res.status >= 400) {
    console.log(res);
    return Promise.reject(`Error: status-code >= 400`);
  }
  const body = await res.json() as User;
  return body;
};

export const checkLoggingIn = async (): Promise<boolean>   => {
  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      'Accept': 'applicaton/json, */*',
    },
    credentials: 'include',
    method: 'GET'
  });
  const body = await res.json();
  switch (body.status) {
    case 'OK':
      return true;
    case 'Unauthorized':
      return false;
    default:
      return Promise.reject(`Fail to catch response ${res}`);
  }
};

export const signUp = async (user: UserForSignUp) => {
  const body = JSON.stringify(user);
  console.log(body);

  const res = await fetch(`${getHostAPI()}/public/signup`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body
  });
  if (res.status >= 400) {
    console.log(res);
    return Promise.reject(`Error: status-code >= 400`);
  }
};