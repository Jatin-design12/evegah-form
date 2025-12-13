import UserSidebar from "../../components/UserSidebar";

export default function ReturnVehicle() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <UserSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Return Vehicle
        </h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Vehicle return process will be handled here.
          </p>
        </div>
      </main>
    </div>
  );
}
