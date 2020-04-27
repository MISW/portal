import {
  ConfigurableProfile,
  UserInfoJSON,
  toUserProfile,
  toUserInfoJSON,
  UserWithPaymentJSON,
  PaymentTableData,
  toPaymentTableData,
} from "./user";

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

export const getProfile = async (): Promise<ConfigurableProfile> => {
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

export const updateProfile = async (
  user: ConfigurableProfile
): Promise<ConfigurableProfile> => {
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
  const resUser = ((await res.json()) as unknown) as UserInfoJSON;
  console.log(resUser);
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

export const signUp = async (user: ConfigurableProfile) => {
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

export const logout = async () => {
  const res = await fetch(`${getHostAPI()}/private/logout`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code >= 400");
  }
};

export const listUsers = async (): Promise<Array<PaymentTableData>> => {
  const res = await fetch(`${getHostAPI()}/private/management/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code >= 400");
  }
  const userList = (await res.json()).users as Array<UserWithPaymentJSON>;
  if (!Array.isArray(userList)) {
    console.error(userList);
    throw new Error("not array");
  }
  console.log(userList);
  return userList.map((u) => toPaymentTableData(u));
};

export const addPaymentStatus = async (id: number) => {
  const res = await fetch(`${getHostAPI()}/private/management/payment_status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      user_id: id,
    })
  });

  if (res.status == 409) {
    return;
  }

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }
};

export const deletePaymentStatus = async (id: number) => {
  const res = await fetch(`${getHostAPI()}/private/management/payment_status`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      user_id: id,
    })
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }
};

export const getUserAsAdmin = async (id: number): Promise<UserWithPaymentJSON> => {
  const res = await fetch(`${getHostAPI()}/private/management/user?user_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }

  return (await res.json()).user as UserWithPaymentJSON;
};
