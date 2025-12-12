// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import dynamic from "next/dynamic";

// Carrega o componente apenas no cliente, sem SSR
const ModelViewerWrapper = dynamic(
  () => import("@/components/ModelViewerWrapper"),
  { ssr: false }
);

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [redirectDone, setRedirectDone] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleModelLoaded = () => {
    setModelLoaded(true);
  };

  useEffect(() => {
    if (!modelLoaded || !isClient || redirectDone) return;

    const animationDuration = 3000; // ajuste conforme sua animação
    const timer = setTimeout(() => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        const width = typeof window !== "undefined" ? window.innerWidth : 0;
        if (user) {
          router.replace("/home");
        } else {
          router.replace(width < 768 ? "/welcome/mobile" : "/welcome");
        }
        setRedirectDone(true);
        unsubscribe();
      });
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [modelLoaded, isClient, router, redirectDone]);

  // Enquanto carrega, mostra o model viewer (só no cliente)
  return <ModelViewerWrapper onLoaded={handleModelLoaded} />;
}