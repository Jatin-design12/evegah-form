export default function Step2RentalPlan({ onPrev, onNext }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        2. Rental Plan & Vehicle Details
      </h2>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">
            Rental Start Date & Time <span className="text-red-500">*</span>
          </label>
          <input type="datetime-local" className="input" />
        </div>

        <div>
          <label className="label">
            Rental Package <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 mt-2">
            {["Hourly", "Daily", "Weekly", "Monthly"].map((p) => (
              <label key={p} className="flex items-center gap-2">
                <input type="radio" name="package" />
                {p}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">
            Return Date & Time <span className="text-red-500">*</span>
          </label>
          <input type="datetime-local" className="input" />
        </div>

        <div>
          <label className="label">
            Rental Package Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input type="number" className="input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <input type="number" className="input" />
        </div>

        <div>
          <label className="label">
            Total Rental Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input type="number" className="input" />
        </div>
      </div>

      {/* PAYMENT */}
      <div className="mb-4">
        <label className="label">
          Payment Mode <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" defaultChecked />
            Cash
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" />
            Online
          </label>
        </div>
      </div>

      {/* VEHICLE */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">E-Bike Model</label>
          <select className="input">
            <option>Mink</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="label">Vehicle Number</label>
          <input className="input" placeholder="MP01AB1234" />
        </div>
      </div>

      <div className="mb-6">
        <label className="label">
          Pre-ride Vehicle Photos <span className="text-red-500">*</span>
        </label>
        <button className="mt-2 px-4 py-2 border rounded-lg">
          📷 Add Photo (0/4)
        </button>
        <p className="text-sm text-gray-500 mt-1">
          Capture at least one photo before starting the ride.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="text-gray-600 hover:text-black"
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
