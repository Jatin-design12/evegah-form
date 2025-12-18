import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRiderForm } from "../RiderFormContext";

export default function Step2Identity() {
  const { formData, updateForm } = useRiderForm();
  const navigate = useNavigate();

  const [attempted, setAttempted] = useState(false);

  const PACKAGE_OPTIONS = ["hourly", "daily", "weekly", "monthly"];
  const PAYMENT_OPTIONS = ["cash", "upi", "card", "bank"];
  const BIKE_ID_OPTIONS = [
    "EVM1024003",
    "EVM1024004",
    "EVM1024005",
    "EVM1024006",
    "EVM1024007",
    "EVM1024008",
    "EVM1024009",
    "EVM1024010",
    "EVM1024011",
    "EVM1024012",
    "EVM1024013",
    "EVM1024014",
    "EVM1024015",
    "EVM1024016",
    "EVM1024017",
    "EVM1024018",
    "EVM1024019",
    "EVM1024020",
    "EVM1024021",
    "EVM1024022",
    "EVM1024023",
    "EVM1024024",
    "EVM1024025",
    "EVM1025029",
    "EVM1025030",
    "EVM1025031",
    "EVM1025032",
    "EVM2025001",
    "EVM2025002",
    "EVM2025003",
    "EVM2025004",
    "EVM2025005",
    "EVM2025006",
    "EVM2025007",
    "EVM2025008",
  ];
  const ACCESSORY_OPTIONS = [
    { key: "mobile_holder", label: "Mobile holder" },
    { key: "mirror", label: "Mirror" },
    { key: "helmet", label: "Helmet" },
    { key: "extra_battery", label: "Extra battery" },
  ];

  const toggleAccessory = (key) => {
    const current = Array.isArray(formData.accessories) ? formData.accessories : [];
    if (current.includes(key)) {
      updateForm({ accessories: current.filter((x) => x !== key) });
    } else {
      updateForm({ accessories: [...current, key] });
    }
  };

  const isNonEmpty = (v) => Boolean(String(v ?? "").trim());

  const isValid =
    isNonEmpty(formData.rentalStart) &&
    isNonEmpty(formData.rentalPackage) &&
    isNonEmpty(formData.paymentMode) &&
    Number(formData.rentalAmount || 0) > 0 &&
    Number(formData.securityDeposit ?? 0) >= 0 &&
    isNonEmpty(formData.bikeModel) &&
    isNonEmpty(formData.bikeId) &&
    isNonEmpty(formData.batteryId);

  const handleNext = () => {
    setAttempted(true);
    if (!isValid) return;
    navigate("../step-3");
  };

  return (
    <div className="space-y-5">
      <div className="card space-y-6 mx-auto w-full max-w-5xl">
        <div>
          <h3 className="text-base font-semibold text-evegah-text">Rental Details</h3>
          <p className="text-sm text-gray-500">
            Fill rental plan, vehicle details, and accessories issued.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Rental Start Date &amp; Time</label>
            <input
              type="datetime-local"
              className="input"
              value={formData.rentalStart || ""}
              onChange={(e) => updateForm({ rentalStart: e.target.value })}
            />
            {attempted && !isNonEmpty(formData.rentalStart) ? (
              <p className="error">Rental start date &amp; time is required.</p>
            ) : null}
          </div>

          <div>
            <label className="label">Return Date</label>
            <input
              type="datetime-local"
              className="input"
              value={formData.rentalEnd || ""}
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">
              Auto: calculated from package
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Rental Package</label>
            <select
              className="select"
              value={formData.rentalPackage || "daily"}
              onChange={(e) => updateForm({ rentalPackage: e.target.value })}
            >
              {PACKAGE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            {attempted && !isNonEmpty(formData.rentalPackage) ? (
              <p className="error">Select a rental package.</p>
            ) : null}
          </div>

          <div>
            <label className="label">Payment Mode</label>
            <select
              className="select"
              value={formData.paymentMode || "cash"}
              onChange={(e) => updateForm({ paymentMode: e.target.value })}
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p.toUpperCase()}
                </option>
              ))}
            </select>
            {attempted && !isNonEmpty(formData.paymentMode) ? (
              <p className="error">Select a payment mode.</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="label">Rental Package Amount</label>
            <input
              type="number"
              min="0"
              className="input"
              value={formData.rentalAmount ?? ""}
              onChange={(e) =>
                updateForm({ rentalAmount: Number(e.target.value || 0) })
              }
            />
            {attempted && !(Number(formData.rentalAmount || 0) > 0) ? (
              <p className="error">Enter rental amount (greater than 0).</p>
            ) : null}
          </div>

          <div>
            <label className="label">Security Deposit</label>
            <input
              type="number"
              min="0"
              className="input"
              value={formData.securityDeposit ?? ""}
              onChange={(e) =>
                updateForm({ securityDeposit: Number(e.target.value || 0) })
              }
            />
            {attempted && Number(formData.securityDeposit ?? 0) < 0 ? (
              <p className="error">Security deposit cannot be negative.</p>
            ) : null}
          </div>

          <div>
            <label className="label">Total Rental Amount</label>
            <input
              type="number"
              min="0"
              className="input"
              value={formData.totalAmount ?? 0}
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">Auto: amount + deposit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">E-bike Model</label>
            <input
              className="input"
              placeholder="Model name"
              value={formData.bikeModel || ""}
              onChange={(e) => updateForm({ bikeModel: e.target.value })}
            />
            {attempted && !isNonEmpty(formData.bikeModel) ? (
              <p className="error">E-bike model is required.</p>
            ) : null}
          </div>

          <div>
            <label className="label">E-Bike ID No </label>
            <input
              className="input"
              list="ev-egah-bike-ids"
              placeholder="Type to search..."
              value={formData.bikeId || ""}
              onChange={(e) => updateForm({ bikeId: e.target.value })}
            />
            <datalist id="ev-egah-bike-ids">
              {BIKE_ID_OPTIONS.map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
            {attempted && !isNonEmpty(formData.bikeId) ? (
              <p className="error">E-bike ID is required.</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label">Battery ID </label>
            <input
              className="input"
              list="ev-egah-battery-ids"
              placeholder="Type to search..."
              value={formData.batteryId || ""}
              onChange={(e) => updateForm({ batteryId: e.target.value })}
            />
            <datalist id="ev-egah-battery-ids">
              <option value="BAT-001" />
              <option value="BAT-002" />
              <option value="BAT-003" />
            </datalist>
            {attempted && !isNonEmpty(formData.batteryId) ? (
              <p className="error">Battery ID is required.</p>
            ) : null}
          </div>

          <div>
            <label className="label">Accessories Issued</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ACCESSORY_OPTIONS.map((a) => (
                <label key={a.key} className="flex items-center gap-2 text-sm text-evegah-text">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={(Array.isArray(formData.accessories) ? formData.accessories : []).includes(a.key)}
                    onChange={() => toggleAccessory(a.key)}
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="label">Other Accessories</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="Optional"
            value={formData.otherAccessories || ""}
            onChange={(e) => updateForm({ otherAccessories: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-t border-evegah-border pt-4">
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("../step-1")}
          >
            ← Back
          </button>

          <button
            type="button"
            className="btn-primary disabled:opacity-50"
            onClick={handleNext}
            disabled={!isValid}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
