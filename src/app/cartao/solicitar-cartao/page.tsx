// app/solicitar-cartao/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SolicitarCartaoPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<'proprio' | 'presente' | null>(null);

  const handleContinue = () => {
    if (tipo === 'proprio') {
      // Salva escolha no localStorage (opcional, para persistência)
      localStorage.setItem('mimo_tipo_cartao', 'proprio');
      router.push('/solicitar-cartao/tipo'); // Próxima etapa: físico ou digital
    } else if (tipo === 'presente') {
      localStorage.setItem('mimo_tipo_cartao', 'presente');
      router.push('/solicitar-cartao/tipo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo ou ícone (opcional) */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <span className="text-2xl">🪪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Solicitar Cartão Mimo</h1>
          <p className="text-gray-600 mt-2">
            Escolha como você quer seu cartão Mimo Meu e Seu.
          </p>
        </div>

        {/* Opções */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setTipo('proprio')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              tipo === 'proprio'
                ? 'border-rose-600 bg-rose-50'
                : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            <h2 className="font-semibold text-gray-800 flex items-center">
              <span className="mr-3">👤</span> Para mim
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Use para suas compras online e presenciais. Recarregue e ganhe benefícios.
            </p>
          </button>

          <button
            onClick={() => setTipo('presente')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              tipo === 'presente'
                ? 'border-rose-600 bg-rose-50'
                : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            <h2 className="font-semibold text-gray-800 flex items-center">
              <span className="mr-3">🎁</span> Presentear alguém
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Envie um cartão com saldo e mensagem personalizada para quem você ama.
            </p>
          </button>
        </div>

        {/* Botão de continuar */}
        <button
          onClick={handleContinue}
          disabled={!tipo}
          className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
            tipo
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>

        {/* Link de retorno */}
        <div className="text-center mt-6">
          <Link href="/" className="text-rose-600 hover:underline text-sm">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}