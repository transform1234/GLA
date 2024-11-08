import { lazy } from "react";

const Videos = lazy(() => import("../pages/videos"));
const Home = lazy(() => import("../pages/Home"));

export default [
  {
    path: "/videos",
    component: Videos,
  },
  {
    path: "*",
    component: Home,
  },
];
