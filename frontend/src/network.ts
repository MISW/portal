import { PaymentStatus } from "./user";

const getHostAPI = () => `${location.protocol}//${location.host}/api`;

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
