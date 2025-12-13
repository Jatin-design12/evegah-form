import { createContext, useContext, useState } from "react";

const RiderFormContext = createContext();

export function RiderFormProvider({ children }) {
  const [formData, setFormData] = useState({});

  const updateForm = (data) =>
    setFormData((prev) => ({ ...prev, ...data }));

  return (
    <RiderFormContext.Provider value={{ formData, updateForm }}>
      {children}
    </RiderFormContext.Provider>
  );
}

export const useRiderForm = () => useContext(RiderFormContext);
