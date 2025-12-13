import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";

export default function SignaturePad({ onSave }) {
  const sigRef = useRef(null);

  const handleClear = () => {
    sigRef.current.clear();
    onSave(null);
  };

  const handleSave = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please provide a signature first");
      return;
    }
    const dataUrl = sigRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 700,
          height: 200,
          className: "border rounded-md bg-gray-50",
        }}
      />

      <div className="flex gap-4 mt-2 text-sm">
        <button
          type="button"
          onClick={handleClear}
          className="text-red-600 hover:underline"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="text-purple-600 hover:underline"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}
