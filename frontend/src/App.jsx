import { DefaultLayout } from "./Layouts";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import routes from "./routes";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import checkCurrentUser from "./utils/checkCurrentUser";

function App() {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  const navigate = useNavigate();

  const publicPaths = [
    "/login",
    "/employee-login",
    "/employee-register",
    "/",
    "/verify-code",
    "/employee-login-email",
  ];

  const getDashboardRoute = () => {
    if (checkCurrentUser("owner")) {
      return "/manage-employee";
    } else {
      return "/manage-task";
    }
  };

  useEffect(() => {
    if (token === null && !publicPaths.includes(location.pathname)) {
      navigate("/login");
    }

    if (token && publicPaths.includes(location.pathname)) {
      const dashboardRoute = getDashboardRoute();
      navigate(dashboardRoute);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <Routes>
        {routes.map((route, index) => {
          const Page = route.page;
          const Layout = route.layout === null ? DefaultLayout : route.layout;

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
