import { Suspense, useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import guestRoutes from "./routes/guest";
import authRoutes from "./routes/auth";
import Loading from "./components/common/Loading";
import customTheme from "./utils/theme";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { checkUserDetails } from "./services/auth/auth";
import teacherAuthRoutes from "./routes/teacherAuth";
import { jwtDecode } from "jwt-decode";

const theme = extendTheme(customTheme);

function AppRouter() {
  const [routes, setRoutes] = useState([]);
  const [token, setToken] = useState();
  const [authUser, setAuthUser] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (token && token !== "not-logged-in") {
      const tokenDecoded = jwtDecode(token);
      const roles = tokenDecoded?.resource_access?.["hasura-app"]?.roles;
      if (authUser && Array.isArray(roles) && roles.includes("teacher")) {
        setRoutes(teacherAuthRoutes);
        navigate("/class");
      } else if (authRoutes) {
        setRoutes(authRoutes);
      }
    } else {
      setRoutes(guestRoutes);
    }
    const init = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      if (!localStorage.getItem("did")) {
        localStorage.setItem("did", visitorId);
      }
    };
    init();
  }, [token]);

  useEffect(() => {
    const validateUser = async () => {
      const result = await checkUserDetails();

      if (result?.success && result?.token) {
        setToken(result?.token);
        setAuthUser(result?.data);
      } else {
        setToken("not-logged-in");
      }
      if (result?.isRefresh) {
        navigate(0);
      }
    };

    validateUser();
  }, [location?.pathname]); // call on page change

  if (!token) {
    return <Loading />;
  }

  return (
    <Routes>
      {routes?.map((item, index) => (
        <Route
          key={item?.path + index}
          path={item?.path}
          element={<item.component {...{ authUser }} />}
        />
      ))}
    </Routes>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <Router>
          <AppRouter />
        </Router>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
