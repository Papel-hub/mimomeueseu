"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const auth = getAuth(app);

    // Escuta mudanças de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ Usuário logado → vai direto para /home
        router.replace("/home");
      } else {
        // ❌ Usuário não logado → verifica tipo de dispositivo
        const width = window.innerWidth;

        if (width < 768) {
          router.replace("/welcome/mobile");
        } else {
          router.replace("/welcome");
        }
      }

      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [isClient, router]);

  // Enquanto verifica login, evita piscar tela
  if (isCheckingAuth) return null;

  return null;
}
