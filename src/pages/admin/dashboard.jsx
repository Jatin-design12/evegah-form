import AdminSidebar from "../../components/admin/AdminSidebar";
import StatCard from "../../components/admin/StatCard";

import {
  Users,
  Bike,
  IndianRupee,
  Clock,
} from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  // ===== Stats =====
  const stats = [
    { title: "Total Users", value: "1,245", icon: Users },
    { title: "Total Rentals", value: "4,382", icon: Bike },
    { title: "Revenue", value: "₹12,40,500", icon: IndianRupee },
    { title: "Active Rides", value: "12", icon: Clock },
  ];

  // ===== Revenue Chart Data =====
  const revenueData = [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 72000 },
    { month: "Jun", revenue: 69000 },
  ];

  // ===== Rentals Chart Data =====
  const rentalsData = [
    { day: "Mon", rentals: 45 },
    { day: "Tue", rentals: 52 },
    { day: "Wed", rentals: 40 },
    { day: "Thu", rentals: 60 },
    { day: "Fri", rentals: 72 },
    { day: "Sat", rentals: 95 },
    { day: "Sun", rentals: 30 },
  ];

  // ===== Recent Users =====
  const recentUsers = [
    { name: "Himanshu", mobile: "8128251172" },
    { name: "Ravi Sharma", mobile: "9876543210" },
    { name: "Amit Patel", mobile: "8899001122" },
  ];

  // ===== Active Rentals Widget =====
  const activeRentals = [
    { id: "RENT1021", user: "Himanshu", vehicle: "Ola S1", duration: "22 mins" },
    { id: "RENT1022", user: "Ravi Sharma", vehicle: "Ather 450X", duration: "12 mins" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Page */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* ====== Stats Cards ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((item, i) => (
            <StatCard
              key={i}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </div>

        {/* ====== Charts Section ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rentals Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Weekly Rentals</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rentalsData}>
                <Bar dataKey="rentals" fill="#10B981" radius={[6, 6, 0, 0]} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ====== Extra Widgets Section ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Users Widget */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
            <ul>
              {recentUsers.map((u, i) => (
                <li
                  key={i}
                  className="flex justify-between py-2 border-b last:border-none"
                >
                  <span>{u.name}</span>
                  <span className="text-gray-500">{u.mobile}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Rentals Widget */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Active Rentals</h2>
            <ul>
              {activeRentals.map((r, i) => (
                <li
                  key={i}
                  className="flex justify-between py-3 border-b last:border-none"
                >
                  <div>
                    <p className="font-medium">{r.user}</p>
                    <p className="text-sm text-gray-500">{r.vehicle}</p>
                  </div>
                  <span className="text-purple-600">{r.duration}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
