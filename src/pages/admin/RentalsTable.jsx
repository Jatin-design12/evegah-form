import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTable from "../../components/AdminTable";
import { supabase } from "../../config/supabase";

export default function RentalsTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase
      .from("rentals")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setData(data || []));
  }, []);

  const columns = [
    { key: "bike_number", label: "Bike No" },
    { key: "deposit_amount", label: "Deposit" },
    { key: "rental_amount", label: "Rent" },
    { key: "payment_mode", label: "Payment" },
    { key: "created_at", label: "Created At" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold">Rentals</h1>
        <AdminTable columns={columns} data={data} />
      </main>
    </div>
  );
}
