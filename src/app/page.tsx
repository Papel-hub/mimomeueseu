// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const handleAuthCheck = (user: User | null) => {
      try {
        const isMobile = window.innerWidth < 768;
        if (user) {
          router.replace("/home");
        } else {
          router.replace(isMobile ? "/welcome/mobile" : "/welcome");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        setError("Erro ao redirecionar. Por favor, recarregue a página.");
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthCheck);

    // Failsafe timeout (in case auth state hangs)
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError("Tempo esgotado. Verificando novamente...");
        // Optional: retry logic or fallback redirect
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  if (!isLoading && error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-600 text-white rounded-full text-sm font-medium hover:bg-rose-700 transition"
        >
         
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div
        className="animate-spin w-10 h-10 border-4 border-red-900 rounded-full border-t-transparent"
        aria-label="Carregando..."
      />
      <p className="mt-4 text-gray-500 text-sm"></p>
    </div>
  );
}