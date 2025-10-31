'use client';

import { useState } from 'react';
import CupidoCard  from './CupidoCard';
import type { Cupido } from '@/types/cupidos';

export  default function MapSection() {
  const [cep, setCep] = useState('');
  // Simulação de dados — em produção, viria de uma API
const cupidos: Cupido[] = [
  {
    id: '1',
    name: 'Ana Clara',
    location: 'São Paulo, SP',
    services: ['ambos'], // agora o TS sabe que deve ser do tipo permitido
    avatar: '/avatars/ana.jpg',
    whatsapp: '+5511999999999',
  },
  {
    id: '2',
    name: 'Rafael Souza',
    location: 'Rio de Janeiro, RJ',
    services: ['entregas'],
    whatsapp: '+5521988888888',
  },
];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você integraria com sua API para buscar por CEP
    alert(`Buscando Cupidos próximos ao CEP: ${cep}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E4B1AE]/20">
      <form onSubmit={handleSubmit} className="mb-6 max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite seu CEP ou cidade"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
          />
          <button
            type="submit"
            className="bg-[#DAA520] text-white px-6 rounded-full font-medium hover:bg-[#c8961e] transition"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cupidos.map((cupido) => (
          <CupidoCard key={cupido.id} {...cupido} />
        ))}
      </div>

      {/* Placeholder para mapa real (ex: Google Maps ou Mapbox) */}
      <div className="mt-8 bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
        🗺️ Mapa interativo (integrar com Google Maps na versão final)
      </div>
    </div>
  );
}