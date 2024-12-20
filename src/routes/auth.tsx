import { lazy } from "react";

const Videos = lazy(() => import("../pages/videos"));
const Home = lazy(() => import("../pages/Home"));
const Watch = lazy(() => import("../pages/videos/SearchPage"));

export default [
  {
    path: "/search",
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
