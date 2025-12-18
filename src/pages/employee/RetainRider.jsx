import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import EmployeeLayout from "../../components/layouts/EmployeeLayout";
import useAuth from "../../hooks/useAuth";
import { apiFetch } from "../../config/api";
import { RiderFormProvider, useRiderForm } from "./RiderFormContext";

const sanitizeNumericInput = (value, maxLength) =>
  String(value || "")
    .replace(/\D/g, "")
    .slice(0, maxLength);

function RetainRiderInner() {
  const { formData, updateForm, resetForm } = useRiderForm();

  const preRidePhotosInputRef = useRef(null);

  const [searchPhone, setSearchPhone] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!imagePreview?.src) return;
    const prevOverflow = document.body.style.overflow;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [imagePreview?.src]);

  const selected = Boolean(formData.isRetainRider && formData.existingRiderId);

  const PACKAGE_OPTIONS = ["hourly", "daily", "weekly", "monthly"];
  const PAYMENT_OPTIONS = ["cash", "upi", "card", "bank"];
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

  const handleSearch = async () => {
    setError("");

    const mobileDigits = sanitizeNumericInput(searchPhone, 10);
    const name = String(searchName || "").trim();

    if (!mobileDigits && !name) {
      setError("Enter mobile number or name to search.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "20");
      if (mobileDigits) params.set("search", mobileDigits);
      if (name) params.set("search", name);

      const result = await apiFetch(`/api/riders?${params.toString()}`);
      const rows = Array.isArray(result?.data) ? result.data : [];
      setResults(rows);
      if (rows.length === 0) {
        setError("No rider found for the given search.");
      }
    } catch (e) {
      setError(String(e?.message || e || "Unable to search riders"));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (r) => {
    const name = r?.full_name || r?.name || "";
    const phone = sanitizeNumericInput(r?.mobile || r?.phone || "", 10);
    const aadhaar = sanitizeNumericInput(r?.aadhaar || "", 12);
    const gender = r?.gender || "";

    const dobRaw = r?.dob || r?.date_of_birth || "";
    const dob = dobRaw ? String(dobRaw).slice(0, 10) : "";

    updateForm({
      name,
      phone,
      aadhaar,
      gender,
      dob,
      aadhaarVerified: Boolean(aadhaar),
      isRetainRider: true,
      existingRiderId: r?.id || null,
    });
    setResults([]);
    setError("");
  };

  const upiId = import.meta.env.VITE_EVEGAH_UPI_ID || "";
  const payeeName = import.meta.env.VITE_EVEGAH_PAYEE_NAME || "Evegah";
  const amount = Number(formData.totalAmount || 0);

  const upiPayload = useMemo(() => {
    if (!upiId) return "";
    const params = new URLSearchParams({
      pa: upiId,
      pn: payeeName,
      am: amount ? String(amount) : "",
      cu: "INR",
    });
    return `upi://pay?${params.toString()}`;
  }, [upiId, payeeName, amount]);

  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
  const getImageDataUrl = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && typeof value.dataUrl === "string") return value.dataUrl;
    return "";
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Unable to read file"));
      reader.readAsDataURL(file);
    });

  const validateImageFile = (file) => {
    if (!file) return "No file selected";
    if (!String(file.type || "").startsWith("image/")) return "Please select an image file";
    if (file.size > MAX_IMAGE_BYTES) return "Image must be 5MB or smaller";
    return "";
  };

  const handlePreRidePhotosPick = async (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;

    const current = Array.isArray(formData.preRidePhotos) ? formData.preRidePhotos : [];
    const remainingSlots = Math.max(0, 8 - current.length);
    if (remainingSlots === 0) {
      setPaymentError("You can upload up to 8 pre-ride photos.");
      return;
    }

    const picked = list.slice(0, remainingSlots);
    try {
      const uploads = await Promise.all(
        picked.map(async (file) => {
          const validation = validateImageFile(file);
          if (validation) throw new Error(validation);
          const dataUrl = await readFileAsDataUrl(file);
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl,
            updatedAt: new Date().toISOString(),
          };
        })
      );
      updateForm({ preRidePhotos: [...current, ...uploads] });
    } catch (e) {
      setPaymentError(String(e?.message || e || "Unable to upload pre-ride photos"));
    }
  };

  const handleComplete = async () => {
    setPaymentError("");

    if (!formData.existingRiderId) {
      setPaymentError("Select a rider before completing payment.");
      return;
    }

    if (!formData.rentalStart) {
      setPaymentError("Rental start date & time is required.");
      return;
    }

    if (!Array.isArray(formData.preRidePhotos) || formData.preRidePhotos.length === 0) {
      setPaymentError("Upload at least one pre-ride vehicle photo.");
      return;
    }

    setSavingPayment(true);
    try {
      const startIso = new Date(formData.rentalStart).toISOString();
      const endIso = formData.rentalEnd ? new Date(formData.rentalEnd).toISOString() : null;

      await apiFetch("/api/rentals", {
        method: "POST",
        body: {
          rider_id: formData.existingRiderId,
          start_time: startIso,
          end_time: endIso,
          vehicle_number: formData.vehicleNumber || formData.bikeId || null,
          rental_package: formData.rentalPackage || null,
          rental_amount: Number(formData.rentalAmount || 0),
          deposit_amount: Number(formData.securityDeposit || 0),
          total_amount: Number(formData.totalAmount || 0),
          payment_mode: formData.paymentMode || null,
          bike_model: formData.bikeModel || null,
          bike_id: formData.bikeId || null,
          battery_id: formData.batteryId || null,
          accessories: Array.isArray(formData.accessories) ? formData.accessories : [],
          other_accessories: formData.otherAccessories || null,
          documents: {
            preRidePhotos: Array.isArray(formData.preRidePhotos) ? formData.preRidePhotos : [],
          },
        },
      });

      alert("Payment recorded");

      resetForm();
      setResults([]);
      setSearchName("");
      setSearchPhone("");
    } catch (e) {
      setPaymentError(String(e?.message || e || "Unable to save payment"));
    } finally {
      setSavingPayment(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Riders
          </p>
          <h1 className="text-2xl font-semibold text-evegah-text">Retain Rider</h1>
          <p className="text-sm text-gray-500">
            Find an existing rider, update rental details, and take payment.
          </p>
        </div>

        <div className="card space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            
            
            <div>
              <label className="label">Rider Name</label>
              <input
                className="input"
                placeholder="Enter name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            
            
            <div>
              <label className="label">Registered Mobile Number</label>
              <input
                className="input"
                placeholder="Enter mobile number"
                value={searchPhone}
                inputMode="numeric"
                maxLength={10}
                onChange={(e) => setSearchPhone(sanitizeNumericInput(e.target.value, 10))}
              />
            </div>

            

            <div className="flex items-end">
              <button
                type="button"
                className="btn-primary w-full disabled:opacity-60"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {error ? <p className="error">{error}</p> : null}

          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-evegah-border">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Mobile</th>
                    <th className="py-2 pr-3 font-medium">Aadhaar</th>
                    <th className="py-2 pr-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="py-3 pr-3">{r.full_name || "-"}</td>
                      <td className="py-3 pr-3">{r.mobile || "-"}</td>
                      <td className="py-3 pr-3">{r.aadhaar || "-"}</td>
                      <td className="py-3 pr-3">
                        <button type="button" className="btn-outline" onClick={() => handleSelect(r)}>
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        {selected ? (
          <div className="card space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-evegah-text">Rider Details</h3>
                <p className="text-sm text-gray-500">Prefilled from registration.</p>
              </div>
              <button
                type="button"
                className="btn-muted"
                onClick={() => {
                  resetForm();
                  setResults([]);
                }}
              >
                Change Rider
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-sm text-evegah-text font-medium">{formData.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Mobile</p>
                <p className="text-sm text-evegah-text font-medium">{formData.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Aadhaar</p>
                <p className="text-sm text-evegah-text font-medium">{formData.aadhaar || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Gender</p>
                <p className="text-sm text-evegah-text font-medium">{formData.gender || "-"}</p>
              </div>
            </div>
          </div>
        ) : null}

        {selected ? (
          <div className="card space-y-6">
            <div>
              <h3 className="text-base font-semibold text-evegah-text">Rental Details</h3>
              <p className="text-sm text-gray-500">Update rental plan and accessories.</p>
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
                  onChange={(e) => updateForm({ rentalAmount: Number(e.target.value || 0) })}
                />
              </div>
              <div>
                <label className="label">Security Deposit</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={formData.securityDeposit ?? ""}
                  onChange={(e) => updateForm({ securityDeposit: Number(e.target.value || 0) })}
                />
              </div>
              <div>
                <label className="label">Total Rental Amount</label>
                <input type="number" className="input" value={formData.totalAmount ?? 0} readOnly />
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
              </div>
              <div>
                <label className="label">E-Bike ID No</label>
                <input
                  className="input"
                  placeholder="Type to search..."
                  value={formData.bikeId || ""}
                  onChange={(e) => updateForm({ bikeId: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="label">Battery ID</label>
                <input
                  className="input"
                  placeholder="Type to search..."
                  value={formData.batteryId || ""}
                  onChange={(e) => updateForm({ batteryId: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Accessories Issued</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {ACCESSORY_OPTIONS.map((a) => (
                    <label
                      key={a.key}
                      className="flex items-center gap-2 text-sm text-evegah-text"
                    >
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

            <div className="rounded-xl border border-evegah-border bg-gray-50 p-4 space-y-3">
              <h3 className="font-medium text-evegah-text">Pre-ride Photos (Required)</h3>
              <p className="text-sm text-gray-500">
                Upload photos of the vehicle before handing over to the rider.
              </p>

              <input
                ref={preRidePhotosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handlePreRidePhotosPick(e.target.files);
                  e.target.value = "";
                }}
              />

              <button
                type="button"
                className="w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-sm text-gray-500 p-5 hover:bg-gray-50 transition"
                onClick={() => preRidePhotosInputRef.current?.click()}
              >
                <p className="mt-1 font-medium">
                  {Array.isArray(formData.preRidePhotos) && formData.preRidePhotos.length > 0
                    ? "Add more photos"
                    : "Click to upload photos"}
                </p>
                <p className="text-xs">PNG, JPG, WEBP (max 5MB each, up to 8)</p>
              </button>

              {Array.isArray(formData.preRidePhotos) && formData.preRidePhotos.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {formData.preRidePhotos.slice(0, 8).map((p, idx) => (
                    <div
                      key={`${p?.name || "photo"}-${idx}`}
                      className="relative rounded-lg overflow-hidden border border-evegah-border bg-white"
                    >
                      <button
                        type="button"
                        className="block w-full"
                        onClick={() =>
                          setImagePreview({
                            src: getImageDataUrl(p),
                            title: "Pre-ride Photo",
                          })
                        }
                        title="Open preview"
                      >
                        <img
                          src={getImageDataUrl(p)}
                          alt="Pre-ride"
                          className="h-16 w-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full border border-evegah-border bg-white/90 text-gray-700 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          const next = [...formData.preRidePhotos];
                          next.splice(idx, 1);
                          updateForm({ preRidePhotos: next });
                        }}
                        title="Remove"
                        aria-label="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No pre-ride photos uploaded yet.</p>
              )}
            </div>
          </div>
        ) : null}

        {selected ? (
          <div className="card space-y-6">
            <div>
              <h3 className="text-base font-semibold text-evegah-text">Payment</h3>
              <p className="text-sm text-gray-500">Scan QR, then print if required.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-evegah-border bg-gray-50 p-4 space-y-3">
                <h4 className="font-medium text-evegah-text">Payment QR</h4>
                {upiPayload ? (
                  <div className="rounded-xl border border-evegah-border bg-white p-4 inline-flex">
                    <QRCodeCanvas value={upiPayload} size={180} />
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    UPI QR is not configured. Set `VITE_EVEGAH_UPI_ID` in your `.env`.
                  </p>
                )}

                <div className="text-sm text-evegah-text space-y-1">
                  <div>
                    <span className="text-gray-500">Total Amount:</span> {amount}
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Mode:</span> {String(formData.paymentMode || "-")}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-evegah-border bg-white p-4 space-y-3">
                <h4 className="font-medium text-evegah-text">Actions</h4>
                <div className="flex flex-wrap gap-2 print:hidden">
                  <button type="button" className="btn-muted" onClick={() => window.print()}>
                    Print Form
                  </button>
                  <button
                    type="button"
                    className="btn-primary disabled:opacity-60"
                    onClick={handleComplete}
                    disabled={savingPayment}
                  >
                    {savingPayment ? "Saving..." : "Complete"}
                  </button>
                </div>

                {paymentError ? <p className="error">{paymentError}</p> : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {imagePreview?.src ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setImagePreview(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl border border-evegah-border bg-white shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-evegah-border px-4 py-3">
              <div className="text-sm font-semibold text-evegah-text truncate">
                {imagePreview.title || "Preview"}
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-xl border border-evegah-border bg-white text-gray-600 hover:bg-gray-50"
                onClick={() => setImagePreview(null)}
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>
            <div className="bg-black/5 p-3">
              <img
                src={imagePreview.src}
                alt={imagePreview.title || "Preview"}
                className="max-h-[75vh] w-full object-contain rounded-xl bg-white"
              />
            </div>
          </div>
        </div>
      ) : null}
    </EmployeeLayout>
  );
}

export default function RetainRider() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <RiderFormProvider user={user}>
      <RetainRiderInner />
    </RiderFormProvider>
  );
}
