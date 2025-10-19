'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaGift } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SolicitarCartaoPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'proprio' | 'presente' | null>(null);

  const handleContinue = () => {
    if (tipo) {
      localStorage.setItem('mimo_tipo_cartao', tipo);
      router.push('/solicitar-cartao/tipo');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 sm:px-8 md:px-16 pt-24 pb-12 sm:pt-28">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Solicitar Cartão Mimo
          </h1>

          <div className="mt-6 text-center">
            <p className="text-red-800 font-semibold mb-2">
              Não foi encontrado cartões associados à sua conta.
            </p>
            <p className="text-gray-600 text-sm">
              Escolha como você quer seu cartão Mimo Meu e Seu.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={() => setTipo('proprio')}
              aria-pressed={tipo === 'proprio'}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                tipo === 'proprio'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaUser size={20}  aria-hidden="true" />
                Para mim
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Use para suas compras online e presenciais. Recarregue e ganhe benefícios.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTipo('presente')}
              aria-pressed={tipo === 'presente'}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                tipo === 'presente'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                
                <FaGift size={20} aria-hidden="true" />
                Presentear alguém
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Envie um cartão com saldo e mensagem personalizada para quem você ama.
              </p>
            </button>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!tipo}
              className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                tipo
                  ? 'bg-red-900 hover:bg-red-800 focus:ring-red-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}