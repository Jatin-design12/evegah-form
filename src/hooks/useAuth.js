import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const token = await getIdTokenResult(firebaseUser);
      setUser(firebaseUser);
      setRole(token.claims.role || "user"); // default = user
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, role, loading };
}
