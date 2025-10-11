"use client";

import { useState, useEffect } from "react";
import Image from "next/image";


export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = ["/images/1.svg", "/images/2.svg", "/images/3.svg"];

  // Auto-avanço do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);


  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado esquerdo - Carrossel (somente em md+) */}
      <div className="hidden md:flex md:w-1/2 bg-red-900 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <Image
            src="/images/logopc.svg"
            alt="Mimo Meu e Seu"
            width={180}
            height={60}
            priority
          />
        </div>

        <div className="relative w-3/4 max-w-xs aspect-square rounded-full overflow-hidden shadow-xl mt-12">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              role="tabpanel"
              aria-hidden={index !== currentSlide}
            >
              <Image
                src={img}
                alt={`Imagem ilustrativa ${index + 1}`}
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-[#FCE1D0]" : "bg-white/60"
              } hover:bg-white`}
            />
          ))}
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <div className="max-w-md w-full mx-auto">

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl text-gray-900">Bem vindo ao</h1>
              <p className="text-2xl md:text-3xl font-bold text-red-900 mt-1">
                Mimo meu e seu!
              </p>
            </div>

      {/* Texto e Botões */}
      <div className="space-y-6 max-w-sm w-full">
        <p className="text-lg font-medium ">
          Palavras dizem. Atitudes provam.
          <strong className="font-bold text-red-900">Surpreender quem você ama!</strong>
        </p>

        <button
          onClick={() => (window.location.href = "/auth/login")}
          className="w-full bg-red-900 py-4 px-3 text-[#FCE1D0] font-semibold rounded-full hover:bg-red-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Entrar na sua conta"
        >
          Entrar na sua conta
        </button>

        <button
          onClick={() => (window.location.href = "/auth/register")}
          className="w-full border border-red-900 py-4 px-3 text-red-900 font-semibold rounded-full hover:bg-red-50  transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Criar uma nova conta"
        >
          Criar uma conta
        </button>
      </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}