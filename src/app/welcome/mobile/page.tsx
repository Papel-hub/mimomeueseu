"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const carouselImages = ["/images/1.svg", "/images/2.svg", "/images/3.svg"];

export default function WelcomeMobilePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-avanço do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []); // ✅ agora o array é estático, então não precisa como dependência

  // Pré-carregar imagens
  useEffect(() => {
    carouselImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-red-900 p-6 text-center">
    <div className=" mb-6 flex justify-center">
  <Image
    src="/images/bm.svg"
    alt="Mimo Meu e Seu"
    width={200}
    height={200}
    priority
  />
</div>  
    {/* Carrossel de Imagens */}
      <div className="relative mb-10 w-3/4 max-w-xs aspect-square rounded-full overflow-hidden shadow-xl">
        {carouselImages.map((img, index) => (
          <div
            key={index}
            role="tabpanel"
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`Imagem ilustrativa ${index + 1} do carrossel`}
              fill
              sizes="(max-width: 400px) 100vw"
              style={{ objectFit: "contain" }} // "contain" geralmente melhor para SVGs
              priority={index === 0} // prioriza a primeira imagem
            />
          </div>
        ))}
      </div>

      {/* Indicadores do carrossel */}
      <div className="mb-10 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : undefined}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-[#FCE1D0]" : "bg-white/50"
            } hover:bg-white`}
          />
        ))}
      </div>

      {/* Texto e Botões */}
      <div className="space-y-6 max-w-sm w-full">
        <p className="text-lg font-medium text-[#FCE1D0]">
          Palavras dizem. Atitudes provam.
          <br />
          <strong className="font-bold">Surpreender quem você ama!</strong>
        </p>

        <button
          onClick={() => (window.location.href = "/auth/login")}
          className="w-full bg-[#FCE1D0] py-4 px-3 text-red-900 font-semibold rounded-full hover:bg-red-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Entrar na sua conta"
        >
          Entrar na sua conta
        </button>

        <button
          onClick={() => (window.location.href = "/auth/register")}
          className="w-full border border-[#FCE1D0] py-4 px-3 text-[#FCE1D0] font-semibold rounded-full hover:bg-red-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Criar uma nova conta"
        >
          Criar uma conta
        </button>
      </div>
    </div>
  );
}