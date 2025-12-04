"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const carouselImages = ["/images/1.svg", "/images/2.svg", "/images/3.svg"];

  // Auto-avanço
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Função de navegação segura
  const safeNavigate = (url: string) => {
    if (!agreed) {
      setShowWarning(true);
      return;
    }
    window.location.href = url;
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ESQUERDA */}
      <div className="hidden md:flex md:w-1/2 bg-red-900 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <Image
            src="/images/logopc.svg"
            alt="Mimo Meu e Seu"
            width={180}
            height={60}
            priority
          />
        </div>

        {/* Carrossel */}
        <div className="relative w-3/4 max-w-xs aspect-square rounded-full overflow-hidden shadow-xl mt-12">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt={`Imagem ilustrativa ${index + 1}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-8 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={`h-3 w-3 rounded-full ${
                index === currentSlide ? "bg-[#FCE1D0]" : "bg-white/40"
              } hover:bg-white`}
            />
          ))}
        </div>

        {/* Links */}
        <ul className="mt-6 text-sm space-y-4 items-center justify-center max-w-md w-full text-[#FCE1D0]">
          <li>
            <Link href="/doc" className="hover:underline">• Política de Privacidade</Link>
          </li>
          <li>
            <Link href="/doc" className="hover:underline">• Termos de Uso e Condições</Link>
          </li>
          <li>
            <Link href="/doc" className="hover:underline">
              • Política de consumo de bebidas alcoólicas
            </Link>
          </li>
          <li>
            <Link href="/doc" className="hover:underline">
              • Regras de vendas e entregas
            </Link>
          </li>
        </ul>
      </div>

      {/* DIREITA */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900">Bem-vindo ao</h1>
            <p className="text-3xl md:text-4xl font-bold text-red-900">Mimo Meu e Seu!</p>
          </div>

          <p className="text-lg font-medium">
            Palavras dizem. Atitudes provam.
            <strong className="text-red-900"> Surpreenda quem você ama!</strong>
          </p>

          {/* BOTÕES */}
          <div className="space-y-4">
            <button
              onClick={() => safeNavigate("/auth/login")}
              className={`w-full py-4 rounded-full font-semibold transition shadow-sm ${
                agreed
                  ? "bg-red-900 text-[#FCE1D0] hover:bg-red-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Entrar
            </button>

            <button
              onClick={() => safeNavigate("/home")}
              className={`w-full py-4 rounded-full font-semibold border transition ${
                agreed
                  ? "border-red-900 text-red-900 hover:bg-red-50"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar como visitante
            </button>
          </div>

          {/* CHECKBOX */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setShowWarning(false);
              }}
              className="h-5 w-5 text-red-900"
            />
            <span className="text-sm text-gray-700">
              Li e concordo com todas as políticas e termos.
            </span>
          </div>

          {/* AVISO */}
          {showWarning && (
            <p className="text-red-600 text-sm font-semibold">
              Você deve concordar antes de continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
