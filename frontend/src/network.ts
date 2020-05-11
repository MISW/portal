import {
  ConfigurableProfile,
  UserInfoJSON,
  toUserProfile,
  toUserInfoJSON,
  UserWithPaymentJSON,
  UserTableData,
  PaymentStatus,
  toUserTableData,
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
    return Promise.reject("Error: status-code >= 400");
  }
  const body = (await res.json()) as UserInfoJSON;
  return toUserProfile(body);
};

export const updateProfile = async (
  user: ConfigurableProfile
): Promise<ConfigurableProfile> => {
  const body = JSON.stringify(toUserInfoJSON(user));

  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
  });
  if (res.status >= 400) {
    return Promise.reject("Error: status-code >= 400");
  }
  const resUser = ((await res.json()) as unknown) as UserInfoJSON;
  return toUserProfile(resUser);
};

export const getPaymentStatuses = async () => {
  const res = await fetch(`${getHostAPI()}/private/profile/payment_statuses`, {
    method: "GET",
    credentials: "include",
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }

  return (await res.json()).payment_statuses as Array<PaymentStatus>;
};

export const checkLoggingIn = async (): Promise<boolean> => {
  const res = await fetch(`${getHostAPI()}/private/profile`, {
    headers: {
      Accept: "application/json, */*",
    },
    credentials: "include",
    method: "GET",
  });
  return res.status < 400;
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

export const listUsers = async (): Promise<Array<UserTableData>> => {
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
  return userList.map((u) => toUserTableData(u));
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
    }),
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
    }),
  });

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }
};

export const getUserAsAdmin = async (
  id: number
): Promise<UserWithPaymentJSON> => {
  const res = await fetch(
    `${getHostAPI()}/private/management/user?user_id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (res.status >= 400) {
    console.error(res);
    return Promise.reject("Error: status-code is " + res.statusText);
  }

  return (await res.json()).user as UserWithPaymentJSON;
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
