// src/lib/hooks/useCartaoStatus.ts (ou onde estiver)

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig'; // ✅ use db diretamente
import { auth } from '@/lib/firebaseConfig'; // ✅ use auth diretamente
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // ✅ tipo correto

export function useCartaoStatus() {
  const [hasCartao, setHasCartao] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'cartoes', user.uid);
        const docSnap = await getDoc(docRef);

        setHasCartao(docSnap.exists());
      } catch (err) {
        const error = err as FirebaseError; // ✅ sem "any"
        console.error('Erro ao verificar cartão:', error);
        setError(error.message || 'Erro desconhecido ao carregar cartão.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { hasCartao, loading, error };
}