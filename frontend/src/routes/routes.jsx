import { DefaultLayout, AuthLayout } from "../layouts";

// Namespace imports
import * as DashboardPages from "../pages/dashboard";
import * as AuthPages from "../pages/auth";
import * as commonPages from "../pages/common";

const routes = [
  // Auth routes
  {
    path: "/manage-task",
    page: DashboardPages.ManageTask,
    layout: DefaultLayout,
  },
  {
    path: "/manage-employee",
    page: DashboardPages.ManageEmployee,
    layout: DefaultLayout,
  },
  {
    path: "/messages",
    page: DashboardPages.Message,
    layout: DefaultLayout,
  },
  {
    path: "/",
    page: AuthPages.Login,
    layout: AuthLayout,
  },
  {
    path: "/register",
    page: AuthPages.Register,
    layout: AuthLayout,
  },
  {
    path: "/verify",
    page: AuthPages.VerificationPage,
    layout: AuthLayout,
  },
  {
    path: "/employee-login",
    page: AuthPages.EmployeeLogin,
    layout: AuthLayout,
  },
  {
    path: "/employee-login-email",
    page: AuthPages.EmployeeLoginWithEmail,
    layout: AuthLayout,
  },
  {
    path: "/employee-register",
    page: AuthPages.EmployeeRegister,
    layout: AuthLayout,
  },

  // Common routes
  {
    path: "/profile",
    page: commonPages.Profile,
    layout: AuthLayout,
  },
];

export default routes;
