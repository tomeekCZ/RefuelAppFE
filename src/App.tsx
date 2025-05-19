import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/profile/Profile";
import CarList from "./features/cars/CarList";
import CarForm from "./features/cars/CarForm";
import RefuelForm from "./features/logs/RefuelForm";
import MapTest from "./features/test/MapTest";
import Analytics from "./features/analytics/Analytics";
import Navbar from "./components/Navbar";
import LogHistory from "./features/logs/LogHistory";
import LogMap from "./features/logs/LogMap";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/cars" element={<RequireAuth><CarList /></RequireAuth>} />
        <Route path="/cars/add" element={<RequireAuth><CarForm /></RequireAuth>} />
        <Route path="/cars/edit/:id" element={<RequireAuth><CarForm /></RequireAuth>} />
        <Route path="/logs/new" element={<RequireAuth><RefuelForm /></RequireAuth>} />
        <Route path="/logs" element={<RequireAuth><LogHistory /></RequireAuth>} />
        <Route path="/logs/map" element={<RequireAuth><LogMap /></RequireAuth>} />
        <Route path="/logs/history" element={<RequireAuth><LogHistory /></RequireAuth>} />
        <Route path="/logs/edit/:id" element={<RequireAuth><RefuelForm /></RequireAuth>} />
        <Route path="/analytics" element={<RequireAuth><Analytics /></RequireAuth>} />
        <Route path="/map-test" element={<RequireAuth><MapTest /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default App;
