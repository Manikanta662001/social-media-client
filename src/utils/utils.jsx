import { toast } from "react-toastify";

export const getFullName = (user) => {
  if (user) {
    return `${user?.firstName} ${user?.lastName}`;
  }
  return "";
};

export const getpage = (type) => {
  if (type === "login") return true;
  return false;
};

export const notification = (sucessMsg, errMsg) => {
  if (sucessMsg) {
    return toast.success(sucessMsg, {
      position: "top-right",
      autoClose: 2000,
    });
  } else {
    toast.error(errMsg, {
      position: "top-right",
      autoClose: 2000,
    });
  }
};
export const updatedMode = (prev) => {
  if (prev === "light") return "dark";
  else return "light";
};

export const setCookie = (token, hours) => {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `logincookie=${token};expires=${d.toUTCString()};path=/`;
};

export const getTokenFromCookie = () => {
  let allCookies = document.cookie.split();
  if (allCookies) {
    let loginCookie = allCookies.filter((cookie) =>
      cookie.includes("logincookie"),
    );
    if (loginCookie) {
      loginCookie = loginCookie[0].split("=");
      return loginCookie[1];
    } else {
      return "";
    }
  } else {
    return "";
  }
};
