import Navbar from "./components/Navbar";
import { authRoutes, defaultRoutes, noAuthRoutes } from "./routes";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "./shared/hooks";
import { Container } from "@mui/material";

function App() {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  return (
    <div className="main">
      <Navbar />
      <Container maxWidth="xl" sx={{ py: "1rem", px: "5rem" }}>
        <Routes>
          {defaultRoutes.map(({ path, Component }) => (
            <Route key={`${Component}`} path={path} element={<Component />} />
          ))}
          {isAuth
            ? authRoutes.map(({ path, Component }) => (
                <Route
                  key={`${Component}`}
                  path={path}
                  element={<Component />}
                />
              ))
            : noAuthRoutes.map(({ path, Component }) => (
                <Route
                  key={`${Component}`}
                  path={path}
                  element={<Component />}
                />
              ))}
        </Routes>
      </Container>
    </div>
  );
}

export default App;
