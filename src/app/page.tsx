// src/app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [redirectDone, setRedirectDone] = useState(false);

  useEffect(() => {
    const handleVideoEnd = () => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        const isMobile = window.innerWidth < 768;

        if (user) {
          router.replace("/home");
        } else {
          router.replace(isMobile ? "/welcome/mobile" : "/welcome");
        }

        setRedirectDone(true);
        unsubscribe();
      });
    };

    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      video.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (video) video.removeEventListener("ended", handleVideoEnd);
    };
  }, [router]);

  if (redirectDone) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
      <video
        ref={videoRef}
        src="/videos/splash_safe.mp4" // 👈 usa a versão segura
        
        playsInline
        preload="auto"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
