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
