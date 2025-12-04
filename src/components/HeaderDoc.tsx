'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeaderDoc() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();

  // 🎯 Sombra ao rolar a página
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-red-900 text-white transition-all duration-300 ${
        scrollY > 10 ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 🧭 Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logopc.svg"
              alt="Mimo Meu e Seu"
              width={120}
              height={60}
              priority
            />
          </div>

          {/* Botão Voltar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="px-3 py-1 gap-2 flex items-center rounded-md text-white bg-red-900 font-semibold hover:bg-red-800 transition"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
