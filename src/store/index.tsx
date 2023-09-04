import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const userState = atom({
  key: "userState",
  default: {
    isLoggedIn: false,
    nickname: "",
    email: "",
  },
});

export const refreshTokenState = atom({
  key: "refreshTokenState",
  default: "",
});
