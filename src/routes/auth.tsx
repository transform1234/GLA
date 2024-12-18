import { lazy } from "react";

const Videos = lazy(() => import("../pages/videos"));
const Home = lazy(() => import("../pages/Home"));
const Watch = lazy(() => import("../pages/videos/watch"));

export default [
  {
    path: "/watch",
    component: Watch,
  },
  {
    path: "/videos",
    component: Videos,
  },
  {
    path: "*",
    component: Home,
  },
];
