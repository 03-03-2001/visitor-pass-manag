import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import Appointments from "./pages/Appointments";
import Passes from "./pages/Passes";
import CheckInOut from "./pages/CheckInOut";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/visitors"
              element={<Visitors />}
            />

            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/passes"
              element={<Passes />}
            />

            <Route
              path="/checkinout"
              element={<CheckInOut />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Route>

        </Route>

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* Invalid URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;