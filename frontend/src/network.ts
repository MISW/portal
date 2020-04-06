import { UserAllInfoJSON, UserProfile, UserInfoJSON, toUserProfile, toUserInfoJSON } from "./user";

const getHostAPI = () => `${location.protocol}//${location.host}/api`;

export const login = async () => {
  const res = await fetch(`${getHostAPI()}/public/login`, {
    headers: {
      Accept: "application/json, */*",
      "Content-type": "application/json",
    },
    method: "POST",
  });
  if (res.status >= 400) {
    return Promise.reject(`Failed to login. Response=${res}`);
  }
  const body = await res.json();
  location.href = body.redirect_url;
};

export const getProfile = async (): Promise<UserProfile> => {
  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      Accept: "application/json, */*",
    },
    credentials: "include",
    method: "GET",
  });
  if (res.status >= 400) {
    console.log(res);
    return Promise.reject("Error: status-code >= 400");
  }
  const body = (await res.json()) as UserInfoJSON;
  console.log(body);
  return toUserProfile(body);
};

export const updateProfile = async (user: UserProfile): Promise<UserProfile> => {
  const body = JSON.stringify(toUserInfoJSON(user));
  console.log(body);

  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  if (res.status >= 400) {
    console.log(res);
    return Promise.reject("Error: status-code >= 400");
  }
  const resUser = (res.json() as unknown) as UserInfoJSON;
  return toUserProfile(resUser);
};

export const checkLoggingIn = async (): Promise<boolean> => {
  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      Accept: "application/json, */*",
    },
    credentials: "include",
    method: "GET",
  });
  const body = await res.json();
  console.log(body);

  // TODO: ガバガバ
  return res.status < 400;
};

export const signUp = async (user: UserProfile) => {
  const body = JSON.stringify(toUserInfoJSON(user));
  console.log(body);

  const res = await fetch(`${getHostAPI()}/public/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  if (res.status >= 400) {
    console.log(res);
    return Promise.reject("Error: status-code >= 400");
  }
};
