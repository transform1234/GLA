import { lazy } from "react";

const Login = lazy(() => import("../pages/auth/Login"));
const Home = lazy(() => import("../pages/Home"));
export default [
  {
    path: "/",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
  },
];
