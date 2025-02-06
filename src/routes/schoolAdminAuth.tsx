import { lazy } from "react";

const SchoolAdminHomepage = lazy(
  () => import("../pages/student-admin/SchoolAdmin")
);

const SchoolAdminDetails = lazy(
  () => import("../pages/student-admin/SchoolAdminDetails")
);

export default [
  {
    path: "/schoolAdmin/:board/:schoolUdise/:grade/:medium/:groupId",
    component: SchoolAdminDetails,
  },
  {
    path: "/schoolAdmin/:board/:schoolUdise/:grade/:medium/:groupId/:subject",
    component: SchoolAdminDetails,
  },
  {
    path: "*",
    component: SchoolAdminHomepage,
  },
];
