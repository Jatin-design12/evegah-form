import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bike,
  Repeat,
  RotateCcw,
  LogOut,
} from "lucide-react";

import Logo from "../assets/evegah-logo.svg";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function UserSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-purple-100 text-purple-700 font-semibold"
      : "text-gray-700 hover:bg-gray-100";

  const logoutUser = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between min-h-screen">
      <div>
        {/* LOGO */}
        <img src={Logo} className="w-32 mb-10 mx-auto" />

        {/* NAV */}
        <nav className="space-y-2">
          <Link
            to="/user/dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isActive(
              "/user/dashboard"
            )}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/user/rider-form"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isActive(
              "/user/rider-form"
            )}`}
          >
            <Bike size={18} />
            New Rider
          </Link>

          <Link
            to="/user/retain-rider"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isActive(
              "/user/retain-rider"
            )}`}
          >
            <Repeat size={18} />
            Retain Rider
          </Link>
          
            
          <Link
            to="/user/return-vehicle"
            className={`flex items-center gap-3 px-4 py-2 rounded-xl ${isActive(
              "/user/return-vehicle"
            )}`}
          >
            <RotateCcw size={18} />
            Return Vehicle
          </Link>
        </nav>
      </div>
            
      {/* LOGOUT */}
      <button
        onClick={logoutUser}
        className="flex items-center gap-2 text-red-600 hover:text-red-700"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
