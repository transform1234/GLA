import { Suspense, useState, useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { initializeI18n } from "./i18n";
import guestRoutes from "./routes/guest";
import authRoutes from "./routes/auth";
import Loading from "./components/common/Loading";
import customTheme from "./utils/theme";

const theme = extendTheme(customTheme);

// initializeI18n("local"); // Initialize i18n with default language
function App() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setRoutes(authRoutes);
    } else {
      setRoutes(guestRoutes);
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            {routes?.map((item, index) => (
              <Route
                key={item?.path + index}
                path={item?.path}
                element={<item.component />}
              />
            ))}
          </Routes>
        </Router>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
