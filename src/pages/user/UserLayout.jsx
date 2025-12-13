import UserSidebar from "../../components/UserSidebar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <UserSidebar />

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
