import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));

export default [
  {
    path: "*",
    component: Login,
  },
];
