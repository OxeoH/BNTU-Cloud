import Navbar from "./components/Navbar";
import { authRoutes, defaultRoutes } from "./routes";
import { Routes, Route } from "react-router-dom";
import { useAppSelector } from "./shared/hooks";

function App() {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  return (
    <div className="main">
      <Navbar />
      <Routes>
        {defaultRoutes.map(({ path, Component }) => (
          <Route key={`${Component}`} path={path} element={<Component />} />
        ))}
        {isAuth ??
          authRoutes.map(({ path, Component }) => (
            <Route key={`${Component}`} path={path} element={<Component />} />
          ))}
      </Routes>
    </div>
  );
}

export default App;
