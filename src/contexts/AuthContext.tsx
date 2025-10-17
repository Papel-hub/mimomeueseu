// src/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { syncUserToFirestore } from '@/lib/syncUserToFirestore'; // ← Importe aqui

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // ✅ Sincroniza com Firestore quando o usuário loga
      if (user) {
        try {
          await syncUserToFirestore(user);
        } catch (error) {
          console.error("Erro ao sincronizar usuário com Firestore:", error);
        }
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);