import { ConfigurableProfile, toUserInfoJSON } from "./user";

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

export const signUp = async (user: ConfigurableProfile) => {
  const body = JSON.stringify(toUserInfoJSON(user));

  const res = await fetch(`${getHostAPI()}/public/signup`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  if (res.status >= 400) {
    return Promise.reject("Error: status-code >= 400");
  }
};

export const inviteToSlack = async () => {
  const res = await fetch(`${getHostAPI()}/private/management/slack/invite`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }
};

export const remindPayment = async () => {
  const res = await fetch(`${getHostAPI()}/private/management/remind_payment`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }
};
