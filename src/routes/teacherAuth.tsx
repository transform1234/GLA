import { lazy } from "react";

const TeacherPage = lazy(() => import("../pages/teacher/TeacherPage"));
const ClassDetailsCard = lazy(() => import("../pages/teacher/ClassDetails"));

export default [
  {
    path: "/class",
    component: TeacherPage,
  },
  {
    path: "/class-details/:board/:schoolUdise/:grade/:medium/:groupId",
    component: ClassDetailsCard,
  },
];
