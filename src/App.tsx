import { Route, Routes } from "react-router-dom";
import Suspend from "@/components/Suspend";
import { lazy } from "react";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const AdminRoutes = lazy(() => import("@/components/AdminRoutes"));

const App = () => {
  return (
    <Routes>
      <Route
        element={
          <Suspend>
            <Login />
          </Suspend>
        }
        path={"/login"}
      />

      <Route
        element={
          <Suspend>
            <AdminRoutes />
          </Suspend>
        }
        path={"/"}
      >
        <Route
          element={
            <Suspend>
              <Home />
            </Suspend>
          }
          path={"/home"}
        />
      </Route>
    </Routes>
  );
};

export default App;
