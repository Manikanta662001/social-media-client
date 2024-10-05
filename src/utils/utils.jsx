import { toast } from "react-toastify";
import { BE_URL } from "./constants";

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
  if (document?.cookie) {
    let allCookies = document?.cookie?.split();
    if (allCookies) {
      let loginCookie = allCookies.filter((cookie) =>
        cookie.includes("logincookie")
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
  }
  else {
    return ''
  }
};

export const getUserFriends = async (userId) => {
  try {
    const response = await fetch(BE_URL + `/users/${userId}/friends`, {
      headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
};

export const generateRoomId = (user, selectedChatUser) => {
  let roomId;
  if (user._id > selectedChatUser._id) {
    roomId = user._id + selectedChatUser._id;
  } else {
    roomId = selectedChatUser._id + user._id;
  }
  return roomId;
};

export function formatTime(date) {
  const dateObj = new Date(date);
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export const getImageFromDb = async (id) => {
  const response = await fetch(BE_URL + "/file/" + id, {
    method: "GET",
  });
  const result = await response.json();
  if (result) {
    const base64 = await new Uint8Array(result.data.data);
    const url = await URL.createObjectURL(
      new Blob([base64], { type: result.data.type })
    );
    return url;
  }
};
