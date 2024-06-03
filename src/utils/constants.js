export const fullName = (user) => {
  if (user) {
    return `${user?.firstName} ${user?.lastName}`;
  }
  return "";
};

export const loginpageType = (type) => {
  if (type === "login") return true;
  return false;
};
