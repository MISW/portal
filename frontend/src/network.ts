const getHostAPI = () => `${location.protocol}//${location.host}/api`;

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
