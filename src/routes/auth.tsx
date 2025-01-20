import path from "path";
import { lazy } from "react";
const Videos = lazy(() => import("../pages/videos"));
const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/videos/SearchPage"));
const Watch = lazy(() =>  import("../pages/videos/WatchScreen"));
const LeaderboardScreen = lazy(() =>  import("../pages/leaderboard/LeaderBoardScreen"));


export default [
  {
    path: "/search",
    component: Search,
  },
  {
    path: "/watch",
    component: Watch,
  },
  {
    path: "/videos",
    component: Videos,
  },
  {
    path : "/leaderboard",
    component: LeaderboardScreen,
  },
  {
    path: "*",
    component: Home,
  },
];
