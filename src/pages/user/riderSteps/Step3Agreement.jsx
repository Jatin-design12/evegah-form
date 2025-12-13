import { useState } from "react";
import SignaturePad from "../../../components/SignaturePad";

export default function Step3Agreement({ onPrev, onSubmit }) {
  const [confirm1, setConfirm1] = useState(false);
  const [confirm2, setConfirm2] = useState(false);
  const [issuer, setIssuer] = useState("");

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* HEADER */}
      <div className="bg-indigo-600 text-white px-6 py-4">
        <h2 className="text-lg font-semibold">
          E-Bike Rental Agreement / Rider Registration
        </h2>
        <p className="text-sm opacity-90">Step 3 of 3 : Agreement</p>
      </div>

      {/* PROGRESS */}
      <div className="h-2 bg-gray-200">
        <div className="h-2 bg-indigo-600 w-full"></div>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">
          3. Acknowledgment & Signature
        </h3>

        <label className="flex items-start gap-3 border rounded-lg p-4">
          <input
            type="checkbox"
            checked={confirm1}
            onChange={(e) => setConfirm1(e.target.checked)}
          />
          <span>
            I confirm all information above is true and correct.
            <span className="text-red-500">*</span>
          </span>
        </label>

        <label className="flex items-start gap-3 border rounded-lg p-4">
          <input
            type="checkbox"
            checked={confirm2}
            onChange={(e) => setConfirm2(e.target.checked)}
          />
          <span>
            I have read and understood all terms & conditions and agree to this
            rental agreement.
            <span className="text-red-500">*</span>
          </span>
        </label>

        <div>
          <label className="block font-medium mb-2">
            Rider Signature <span className="text-red-500">*</span>
          </label>
          <div className="border rounded-lg p-3">
            <SignaturePad />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Date</label>
          <p className="font-medium">{today}</p>
        </div>

        <div>
          <label className="label">
            Issued by (Name) <span className="text-red-500">*</span>
          </label>
          <input
            className="input"
            placeholder="Enter your name"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center px-6 py-4 border-t">
        <button onClick={onPrev} className="text-gray-600 hover:text-black">
          ← Previous
        </button>

        <button
          onClick={onSubmit}
          disabled={!confirm1 || !confirm2 || !issuer}
          className={`px-6 py-2 rounded-lg text-white ${
            confirm1 && confirm2 && issuer
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit Application
        </button>
      </div>
    </div>
  );
}
