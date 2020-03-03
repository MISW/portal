
export const login = async () => {
  const res = await fetch(`${location.protocol}//${location.host}/api/public/login`, {
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

export const checkLoggingIn = async (): Promise<boolean>   => {
  const res = await fetch(`${location.protocol}//${location.host}/api/private/profile`, {
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