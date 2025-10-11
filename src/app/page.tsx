"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Garantir que estamos no cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const checkDeviceAndRedirect = () => {
      const width = window.innerWidth;

      if (width < 768) {
        // Mobile
        router.replace("/welcome/mobile");
      } else {
        // Desktop
        router.replace("/welcome");
      }
    };

    // Executa ao montar
    checkDeviceAndRedirect();

    // Escuta redimensionamento da tela
    window.addEventListener("resize", checkDeviceAndRedirect);

    // Cleanup
    return () => window.removeEventListener("resize", checkDeviceAndRedirect);
  }, [isClient, router]);

  return null;
}
