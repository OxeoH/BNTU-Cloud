import { defaultRoutes } from "./routes";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="main">
      <Routes>
        {defaultRoutes.map(({ path, Component }) => (
          <Route key={`${Component}`} path={path} element={<Component />} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
