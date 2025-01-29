// utility service

import { jwtDecode } from "jwt-decode";

export function uniqueId(length = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getSid() {
  if (!localStorage.getItem("token")) {
    return "";
  }
  const tokenDecoded: any = jwtDecode(localStorage.getItem("token") || "");
  const date = new Date(
    Date.now() + new Date().getTimezoneOffset() * 60 * 1000
  );
  return `${tokenDecoded.sub}_${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_${
    tokenDecoded.session_state
  }`;
}
