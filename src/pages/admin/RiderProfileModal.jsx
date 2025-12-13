import { useEffect, useState } from "react";
import { supabase } from "../../config/supabase";

export default function RiderProfileModal({ rider, close }) {
  const [rides, setRides] = useState([]);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    loadRideHistory();
    loadDocuments();
  }, []);

  async function loadRideHistory() {
    const { data } = await supabase
      .from("rentals")
      .select("*")
      .eq("rider_id", rider.id)
      .order("start_time", { ascending: false });

    setRides(data || []);
  }

  async function loadDocuments() {
    const { data } = await supabase
      .from("rider_documents")
      .select("*")
      .eq("rider_id", rider.id);

    setDocs(data || []);
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center p-10 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Rider Profile</h2>
          <button onClick={close} className="text-lg">✕</button>
        </div>

        {/* Basic Details */}
        <h3 className="text-lg font-semibold mt-4">Details</h3>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <p><strong>Name:</strong> {rider.full_name}</p>
          <p><strong>Mobile:</strong> {rider.mobile}</p>
          <p><strong>Aadhaar:</strong> {rider.aadhaar}</p>
          <p><strong>Status:</strong> {rider.status}</p>
        </div>

        {/* Ride History */}
        <h3 className="text-lg font-semibold mt-6">Ride History</h3>
        <div className="bg-gray-50 p-4 rounded-xl mt-2 max-h-64 overflow-y-auto">
          {rides.length === 0 && <p>No ride history found.</p>}

          {rides.map((ride) => (
            <div key={ride.id} className="border-b py-3">
              <p>
                <strong>Ride:</strong>{" "}
                {new Date(ride.start_time).toLocaleString()} →{" "}
                {ride.end_time
                  ? new Date(ride.end_time).toLocaleString()
                  : "Ongoing"}
              </p>
              <p><strong>Vehicle:</strong> {ride.vehicle_number}</p>
              <p><strong>Amount:</strong> ₹{ride.total_amount}</p>
            </div>
          ))}
        </div>

        {/* Documents */}
        <h3 className="text-lg font-semibold mt-6">Documents</h3>
        <div className="bg-gray-50 p-4 rounded-xl mt-2">
          {docs.length === 0 && <p>No documents uploaded.</p>}

          {docs.map((doc) => (
            <p key={doc.id} className="py-1">
              <strong>{doc.id_type}:</strong>{" "}
              <a
                href={doc.id_file_url}
                target="_blank"
                className="text-blue-600 underline"
              >
                View File
              </a>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
