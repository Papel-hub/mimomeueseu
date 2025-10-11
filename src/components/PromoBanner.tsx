'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = ["/images/s1.svg", "/images/s1.svg", "/images/2.svg"];

  // Auto-avanço
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  }, 5000);
  return () => clearInterval(timer);
}, [carouselImages.length]);


  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  return (
    <section className="relative w-full mb-8">
      {/* Imagem com sobreposição */}
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[490px] xl:h-[510px] rounded-2xl overflow-hidden">
        <Image
          src={carouselImages[currentSlide]}
          alt={`Promoção ${currentSlide + 1}`}
          fill
          className="object-cover object-center transition-opacity duration-500"
          priority
        />

        {/* Camada de sobreposição */}
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white max-w-xl">
            <Link
              href="/cestas"
              className="inline-block bg-white text-red-900 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-100 transition duration-200 shadow-md"
            >
              Compre Agora
            </Link>
          </div>
        </div>
      </div>

      {/* Dots + Navegação manual abaixo da imagem */}
      <div className="flex justify-between  px-1 items-center mt-4 gap-4">
        {/* Dots */}
        <div className="flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-red-800" : "bg-[#FCE1D0]"
              } hover:bg-white`}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="px-2 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-[#FCE1D0] hover:text-red-900 transition"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="px-2 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-[#FCE1D0] hover:text-red-900 transition"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
