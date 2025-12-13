import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bike,
  RotateCcw,
  BarChart3,
  LogOut
} from "lucide-react";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
      isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-10">
      <div className="mb-8">
        <img src="../src/assets/evegah-logo.svg" alt="Evegah" className="h-8" />
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/riders" className={linkClass}>
          <Users size={18} /> Riders
        </NavLink>

        <NavLink to="/admin/rentals" className={linkClass}>
          <Bike size={18} /> Rentals
        </NavLink>

        <NavLink to="/admin/returns" className={linkClass}>
          <RotateCcw size={18} /> Returns
        </NavLink>

        <NavLink to="/admin/analytics" className={linkClass}>
          <BarChart3 size={18} /> Analytics
        </NavLink>

        <button className="flex items-center gap-3 px-4 py-3 text-red-600">
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
}
