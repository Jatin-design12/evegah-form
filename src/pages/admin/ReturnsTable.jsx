import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTable from "../../components/AdminTable";
import { apiFetch } from "../../config/api";

export default function ReturnsTable() {
  const [data, setData] = useState([]);

  const load = async () => {
    const rows = await apiFetch("/api/returns");
    setData(rows || []);
  };

  useEffect(() => {
    let mounted = true;
    load();
    const interval = setInterval(() => {
      if (!mounted) return;
      load();
    }, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: "rental_id", label: "Rental ID" },
    { key: "condition_notes", label: "Condition" },
    { key: "returned_at", label: "Returned At" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold">Returns</h1>
        <AdminTable columns={columns} data={data} />
      </main>
    </div>
  );
}
