export default function Step1RiderDetails({ onNext }) {
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow border">

      {/* HEADER */}
      <div className="bg-indigo-700 text-white rounded-t-xl px-8 py-5">
        <h1 className="text-lg font-semibold">
          E-Bike Rental Agreement / Rider Registration Form
        </h1>
        <p className="text-sm opacity-90 mt-1">Step 1 of 3: Rider Details</p>

        {/* PROGRESS */}
        <div className="w-full bg-indigo-200 h-2 rounded-full mt-4">
          <div className="bg-white h-2 w-1/3 rounded-full"></div>
        </div>
      </div>

      {/* FORM BODY */}
      <div className="p-8 space-y-8">

        {/* RIDER DETAILS */}
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">1. Rider Details</h2>
          <select className="border rounded-md px-3 py-1 text-sm">
            <option>Gotri Zone</option>
          </select>
        </div>

        {/* NAME + MOBILE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input"
              placeholder="As per your government ID"
            />
          </div>

          <div>
            <label className="label">Mobile Number *</label>
            <input className="input" placeholder="9876543210" />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className="label">Permanent Address *</label>
          <textarea
            className="input"
            rows={3}
            placeholder="123, Main Street, City, State, ZIP"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          <span>
            My temporary/mailing address is the same as my permanent address.
          </span>
        </div>

        <div>
          <label className="label">Temporary Address *</label>
          <textarea
            className="input"
            rows={3}
            placeholder="456, Side Road, City, State, ZIP"
          />
        </div>

        {/* REFERENCE + DOB + GENDER */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="label">Reference Name/Number</label>
            <input className="input" placeholder="Jane Doe - 9911223344" />
          </div>

          <div>
            <label className="label">Date of Birth *</label>
            <input type="date" className="input" />
          </div>

          <div>
            <label className="label">Gender *</label>
            <div className="flex gap-4 mt-2 text-sm">
              <label><input type="radio" name="gender" /> Male</label>
              <label><input type="radio" name="gender" /> Female</label>
              <label><input type="radio" name="gender" /> Other</label>
            </div>
          </div>
        </div>

        {/* RIDER PHOTO */}
        <div className="border rounded-lg p-5">
          <h3 className="font-medium mb-2">Rider Photo</h3>

          <div className="border border-red-300 bg-red-50 text-red-600 p-4 rounded-md text-sm">
            <b>Camera Access Required</b><br />
            Camera access is disabled or not available.
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Please capture a clear, forward-facing photo.
          </p>
        </div>

        {/* IDENTITY VERIFICATION */}
        <div className="border rounded-lg p-5">
          <h3 className="font-medium mb-4">Identity Verification</h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="label">Aadhaar Card Number *</label>
              <div className="flex gap-2">
                <input className="input" placeholder="XXXX-XXXX-XXXX" />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  Verify
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Verify via OTP.</p>
            </div>

            <div className="border-dashed border-2 rounded-lg p-6 text-center text-sm text-gray-500">
              <p className="font-medium">Click to upload ID card</p>
              <p>PNG, JPG, or WEBP (max 5MB)</p>
              <p className="text-xs mt-2">
                Upload if OTP verification fails.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center border-t pt-6">
          <button className="text-gray-500 flex items-center gap-2">
            ← Previous
          </button>

          <button
            onClick={onNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
