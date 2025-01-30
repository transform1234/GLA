import { lazy } from "react";

const TeacherHomepage = lazy(() => import("../pages/teacher/TeacherPage"));
const ClassDetails = lazy(() => import("../pages/teacher/ClassDetails"));

export default [
  {
    path: "/class/:board/:schoolUdise/:grade/:medium/:groupId",
    component: ClassDetails,
  },
  {
    path: "*",
    component: TeacherHomepage,
  },
];
