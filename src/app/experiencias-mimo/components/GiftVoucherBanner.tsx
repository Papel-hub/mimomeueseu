// app/components/GiftVoucherBanner.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GiftVoucherBannerProps {
  title: string;
  subtitle: string;
  priceRange?: string;
  experiencesCount?: number;
  description: string;
  ctaText: string;
  backgroundImageUrl?: string; // opcional: se quiseres usar uma imagem específica
}

const GiftVoucherBanner = ({
  title = "Vouchers em Valor e Packs Presente",
  subtitle = "Preços entre: 25,00 € - 1000,00 €",
  experiencesCount = 16,
  description = "Ofereça a alguém especial a oportunidade de escolher qual dos sonhos quer realizar com um voucher em valor ou um pack com várias experiências à escolha.",
  ctaText = "Veja as nossas sugestões clicando aqui",
  backgroundImageUrl = "https://placehold.co/1920x800?text=Golden+Moments+Background"
}: GiftVoucherBannerProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-lg shadow-lg">
      {/* Imagem de fundo */}
      <Image
        src={backgroundImageUrl}
        alt="Fundo de vouchers presente"
        fill
        style={{ objectFit: 'cover' }}
        priority
        className="z-0"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Conteúdo sobreposto */}
      <div className="absolute inset-0 z-20 flex items-center px-6 sm:px-12">
        <div className="max-w-lg bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-1">{subtitle}</p>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Experiências: {experiencesCount}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

          {/* Botão CTA */}
          <button
            className={`w-full sm:w-auto px-6 py-3 bg-red-900 hover:bg-red-800 text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span>{ctaText}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftVoucherBanner;