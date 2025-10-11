// app/solicitar-cartao/tipo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EscolherTipoCartaoPage() {
  const router = useRouter();
  const [tipoCartao, setTipoCartao] = useState<'fisico' | 'digital' | null>(null);
  const [modo, setModo] = useState<'proprio' | 'presente' | null>(null); // 'proprio' ou 'presente'

  // Carrega a escolha anterior do localStorage
  useEffect(() => {
    const savedModo = localStorage.getItem('mimo_tipo_cartao') as 'proprio' | 'presente' | null;
    if (!savedModo) {
      // Se não houver escolha anterior, redireciona para o início
      router.push('/solicitar-cartao');
      return;
    }
    setModo(savedModo);
  }, [router]);

  const handleContinue = () => {
    if (tipoCartao) {
      // Salva a escolha de tipo
      localStorage.setItem('mimo_tipo_entrega', tipoCartao);
      
      // Redireciona para a próxima etapa: formulário de dados
      router.push('/solicitar-cartao/dados');
    }
  };

  if (!modo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-rose-600 rounded-full"></div>
      </div>
    );
  }

  const isPresente = modo === 'presente';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isPresente ? 'Como entregar o presente?' : 'Como você quer seu cartão?'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isPresente
              ? 'Escolha como o presenteado receberá o cartão Mimo.'
              : 'Escolha entre receber em casa ou usar imediatamente no app.'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Cartão Físico */}
          <button
            onClick={() => setTipoCartao('fisico')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              tipoCartao === 'fisico'
                ? 'border-rose-600 bg-rose-50'
                : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Cartão Físico</h2>
                <ul className="text-gray-600 text-sm mt-2 space-y-1">
                  <li>• Entregue em casa com embalagem especial</li>
                  <li>• Material premium (PVC ou cartonagem reforçada)</li>
                  <li>• Com chip NFC e QR Code exclusivo</li>
                  {isPresente && <li>• Inclui mensagem personalizada na caixa</li>}
                </ul>
              </div>
            </div>
          </button>

          {/* Cartão Digital */}
          <button
            onClick={() => setTipoCartao('digital')}
            className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
              tipoCartao === 'digital'
                ? 'border-rose-600 bg-rose-50'
                : 'border-gray-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">Cartão Digital</h2>
                <ul className="text-gray-600 text-sm mt-2 space-y-1">
                  <li>• Disponível imediatamente no app e site</li>
                  <li>• QR Code dinâmico para pagamentos</li>
                  <li>• Ideal para uso rápido ou presente instantâneo</li>
                  {isPresente && <li>• Enviado por e-mail, WhatsApp ou link compartilhável</li>}
                </ul>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!tipoCartao}
          className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
            tipoCartao
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-rose-600 hover:underline text-sm"
          >
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}