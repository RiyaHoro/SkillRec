import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, authLoading, logout }}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { useAuth };
