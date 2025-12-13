import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTable from "../../components/AdminTable";
import { supabase } from "../../config/supabase";

export default function ReturnsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase
      .from("returns")
      .select("*")
      .order("returned_at", { ascending: false })
      .then(({ data }) => setData(data || []));
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
