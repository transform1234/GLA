import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/auth/Login"));

export default [
  {
    path: "*",
    component: Login,
  },
];
