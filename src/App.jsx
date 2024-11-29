import { Suspense, useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import guestRoutes from "./routes/guest";
import authRoutes from "./routes/auth";
import Loading from "./components/common/Loading";
import customTheme from "./utils/theme";
import { checkUserDetails } from "./services/auth/auth";

const theme = extendTheme(customTheme);


function AppRouter() {
  const [routes, setRoutes] = useState([]);
  const [token, setToken] = useState();
  const location = useLocation();
  useEffect(() => {
    
    if (token) {
      setRoutes(authRoutes);
    } else {
      setRoutes(guestRoutes);
    }
  }, [token]);

  useEffect(() => {
    const validateUser = async () => {
      const result = await checkUserDetails();
      
      if (result?.success && result?.token) {
        setToken(result?.token);
      }else {
        setToken();
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
  }

    validateUser();
  }, [location.pathname]); 

  return (
    <Routes>
      {routes?.map((item, index) => (
        <Route
          key={item?.path + index}
          path={item?.path}
          element={<item.component />}
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

  )
}

export default App;
