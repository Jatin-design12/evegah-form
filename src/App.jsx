import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Redirect from "./pages/Redirect";

import AdminDashboard from "./pages/admin/Dashboard";
import RidersTable from "./pages/admin/RidersTable";
import RentalsTable from "./pages/admin/RentalsTable";
import ReturnsTable from "./pages/admin/ReturnsTable";
import Analytics from "./pages/Analytics";


import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import RiderForm from "./pages/user/RiderForm";
import RetainRider from "./pages/user/RetainRider";
import ReturnVehicle from "./pages/user/ReturnVehicle";

import ProtectedRouteAdmin from "./components/ProtectedRouteAdmin";
import ProtectedRouteUser from "./components/ProtectedRouteUser";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<Redirect />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={
          <ProtectedRouteAdmin><AdminDashboard /></ProtectedRouteAdmin>
        } />

        <Route path="/admin/riders" element={
          <ProtectedRouteAdmin><RidersTable /></ProtectedRouteAdmin>
        } />

        <Route path="/admin/rentals" element={
          <ProtectedRouteAdmin><RentalsTable /></ProtectedRouteAdmin>
        } />

        <Route path="/admin/returns" element={
          <ProtectedRouteAdmin><ReturnsTable /></ProtectedRouteAdmin>
        } />

        <Route path="/admin/analytics" element={
          <ProtectedRouteAdmin><Analytics /></ProtectedRouteAdmin>
        } />

        {/* USER */}
        <Route path="/user/dashboard" element={
          <ProtectedRouteUser><UserDashboard /></ProtectedRouteUser>
        } />

         <Route path="/user/rider-form" element={
          <ProtectedRouteUser><RiderForm /></ProtectedRouteUser>
        } />

        <Route path="/user/retain-rider" element={
          <ProtectedRouteUser><RetainRider /></ProtectedRouteUser>
        } />

        <Route path="/user/return-vehicle" element={
          <ProtectedRouteUser><ReturnVehicle /></ProtectedRouteUser>
        } />

      </Routes>
    </BrowserRouter>
  );
}
