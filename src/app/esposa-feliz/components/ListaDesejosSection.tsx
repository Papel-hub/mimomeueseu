'use client';

import { useState } from 'react';
import {  FaGift } from 'react-icons/fa';

export function ListaDesejosSection() {
  const [listaLink] = useState('https://mimomeuese.com/lista/feliz-maria');
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(listaLink);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Meu amor ❤️, criei minha Lista de Desejos na Mimo Meu e Seu! Escolhi com carinho os mimos que me fariam feliz. Você pode ver aqui:\n\n${listaLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-10 bg-[#F4B6B9] rounded-full"></div>
        <FaGift size={32} className="text-[#F4B6B9]" />
        <h2 className="text-2xl font-semibold">Meu Amor Me Mima</h2>
      </div>
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#F4B6B9]/20 shadow-sm">
        <p className="text-gray-700 mb-6">
          Mostre ao seu parceiro exatamente o que te faria feliz. Crie sua lista de desejos e compartilhe com um clique!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleCopiar}
            className="flex-1 bg-white border border-[#F4B6B9] text-[#F4B6B9] py-3 rounded-full font-medium hover:bg-[#FDE8E9] transition"
          >
            {copiado ? '✓ Copiado!' : 'Copiar link'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-[#25D366] text-white py-3 rounded-full font-medium hover:bg-[#128C7E] transition"
          >
            Enviar por WhatsApp
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Ou mostre este QR Code:</p>
          <div className="bg-gray-100 w-32 h-32 mx-auto mt-2 rounded-lg flex items-center justify-center">
            QR Code 
          </div>
        </div>
      </div>
    </section>
  );
}