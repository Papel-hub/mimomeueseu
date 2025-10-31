'use client';

import { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';

export function IndiqueMulherSection() {
  const [amiga, setAmiga] = useState('');
  const [codigoIndicacao] = useState('FELIZ-MARIA'); // viria do backend

  const handleIndicar = () => {
    if (!amiga.trim()) {
      alert('Digite o nome da amiga.');
      return;
    }
    const message = encodeURIComponent(
      `Oi! 😊 Você foi indicada por uma Esposa Feliz para receber um presente especial da Mimo Meu e Seu! Use o código ${codigoIndicacao} para ganhar um mimo surpresa. ❤️\n\nhttps://mimomeuese.com/esposa-feliz`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-10 bg-[#F4B6B9] rounded-full"></div>
        {/* Indique uma Mulher */}
        <FaUserFriends size={32} className="text-[#F4B6B9]" />
        <h2 className="text-2xl font-semibold">Indique uma Mulher</h2>
      </div>
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#F4B6B9]/20 shadow-sm">
        <p className="text-gray-700 mb-6">
          Conhece uma mulher que merece ser mimada? Mãe, irmã, amiga, vizinha... Indique ela e espalhe amor!
        </p>

        <div className="mb-6 p-4 bg-[#FDE8E9] rounded-lg">
          <p className="text-sm text-gray-700 mb-2">Seu código de Esposa Feliz:</p>
          <div className="font-mono font-bold text-[#DAA520]">{codigoIndicacao}</div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Nome da amiga que você quer indicar</label>
          <input
            type="text"
            value={amiga}
            onChange={(e) => setAmiga(e.target.value)}
            placeholder="Ex: Ana Clara"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F4B6B9]"
          />
        </div>

        <button
          onClick={handleIndicar}
          className="w-full bg-[#F4B6B9] text-white py-3 rounded-full font-medium hover:bg-[#e89fa2] transition"
        >
          Enviar indicação via WhatsApp
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Ela receberá um link com seu código e ganhará um desconto ou surpresa!
        </p>
      </div>
    </section>
  );
}