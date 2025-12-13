import UserSidebar from "../../components/UserSidebar";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <UserSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          User Dashboard
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card title="Registration Status" value="Incomplete" />
          <Card title="KYC Status" value="Pending" />
          <Card title="Active Rental" value="No" />
          <Card title="Outstanding Dues" value="₹0" />
        </div>

        {/* ACTION */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Complete Rider Registration
          </h2>

          <p className="text-gray-600 mb-4">
            Please complete your rider registration to continue.
          </p>

          <Link
            to="/user/rider-form"
            className="inline-block px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Start / Continue Registration →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}
