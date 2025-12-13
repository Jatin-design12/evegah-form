    import { useState } from "react";
    import UserSidebar from "../../components/UserSidebar";

    import Step1RiderDetails from "./riderSteps/Step1RiderDetails";
    import Step2Identity from "./riderSteps/Step2Identity";
    import Step3Agreement from "./riderSteps/Step3Agreement";

    export default function RiderForm() {
    const [step, setStep] = useState(1);

    return (
        <div className="flex min-h-screen bg-gray-100">
        <UserSidebar />

        <main className="flex-1 p-6">
            {step === 1 && <Step1RiderDetails onNext={() => setStep(2)} />}
            {step === 2 && (
            <Step2Identity
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
            />
            )}
            {step === 3 && <Step3Agreement onBack={() => setStep(2)} />}
        </main>
        </div>
    );
    }
