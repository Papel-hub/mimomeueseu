// app/solicitar-cartao/tipo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function EscolherTipoCartaoPage() {
  const router = useRouter();
  const [tipoCartao, setTipoCartao] = useState<'fisico' | 'digital' | null>(null);
  const [modo, setModo] = useState<'proprio' | 'presente' | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModo = localStorage.getItem('mimo_tipo_cartao') as 'proprio' | 'presente' | null;
      if (!savedModo) {
        router.push('/solicitar-cartao');
        return;
      }
      setModo(savedModo);
    } else {
      router.push('/solicitar-cartao');
    }
  }, [router]);

  const handleContinue = () => {
    if (tipoCartao) {
      localStorage.setItem('mimo_tipo_entrega', tipoCartao);
      router.push('/solicitar-cartao/dados');
    }
  };

  if (!modo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-gray-600 mb-4">Algo deu errado.</p>
        <button
          type="button"
          onClick={() => router.push('/solicitar-cartao')}
          className="text-rose-600 font-medium hover:underline"
        >
          Voltar e tentar novamente
        </button>
      </div>
    );
  }

  const isPresente = modo === 'presente';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
<main className="flex-grow pt-24 pb-12">
  <div className="max-w-5xl mx-auto px-4">
    {/* Cabeçalho */}
    <div className="text-center mb-10">

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        {isPresente ? 'Como entregar o presente?' : 'Como você quer seu cartão?'}
      </h1>
      <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
        {isPresente
          ? 'Escolha como o presenteado receberá o cartão Mimo.'
          : 'Escolha entre receber em casa ou usar imediatamente no app.'}
      </p>
    </div>

    {/* ✅ Grid com 1 coluna em mobile, 2 em lg+ */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Coluna esquerda: opções */}
      <div className="space-y-6">
        {/* Botão Físico */}
        <button
          type="button"
          onClick={() => setTipoCartao('fisico')}
          aria-pressed={tipoCartao === 'fisico'}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
            tipoCartao === 'fisico'
              ? 'border-rose-600 bg-rose-50'
              : 'border-gray-200 hover:border-rose-300'
          }`}
        >
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaCreditCard size={20} aria-hidden="true" />
                Cartão Físico
              </h2>
              <ul className="text-gray-600 text-sm mt-2 space-y-1 list-disc px-3 list-inside">
                <li>Entregue em casa com embalagem especial</li>
                <li>Material premium (PVC ou cartonagem reforçada)</li>
                <li>Com chip NFC e QR Code exclusivo</li>
                {isPresente && <li>Inclui mensagem personalizada na caixa</li>}
              </ul>
        </button>

        {/* Botão Digital */}
        <button
          type="button"
          onClick={() => setTipoCartao('digital')}
          aria-pressed={tipoCartao === 'digital'}
          className={`w-full text-left p-6 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
            tipoCartao === 'digital'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
          }`}
        >
              <h2 className="font-semibold text-gray-800 flex items-center gap-2 ">
                <FaMobileAlt size={20} aria-hidden="true" />
                Cartão Digital
              </h2>
              <ul className="text-gray-600 text-sm mt-2 space-y-1 list-disc px-3 list-inside">
                <li>Disponível imediatamente no app e site</li>
                <li>QR Code dinâmico para pagamentos</li>
                <li>Ideal para uso rápido ou presente instantâneo</li>
                {isPresente && <li>Enviado por e-mail, WhatsApp ou link compartilhável</li>}
              </ul>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!tipoCartao}
          className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            tipoCartao
              ? 'bg-red-900 hover:bg-red-800 focus:ring-red-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>

      {/* Coluna direita: imagem */}
      <div className="flex justify-center lg:justify-start">
        <div className="w-full max-w-xs lg:max-w-sm rounded-lg bg-white shadow-sm">
          <Image
            src="/images/cartao.svg"
            alt="Cartão Mimo"
            width={300}
            height={300}
            className="w-full object-contain"
            priority
          />
        </div>
      </div>
    </div>
  </div>
</main>
      <Footer />
    </div>
  );
}