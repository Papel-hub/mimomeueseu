'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter, useParams } from 'next/navigation';
import MensagemPreview from './components/MensagemPreview';
import FormatoSelector, { FormatoTipo } from './components/FormatoSelector';
import MensagemForm from './components/MensagemForm';

export default function MensagemPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [isChecked, setIsChecked] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<FormatoTipo>('digital');
  const [prices, setPrices] = useState<Record<FormatoTipo, number>>({
    digital: 79,
    fisico: 129,
    digital_audio: 149,
    digital_video: 179,
    digital_fisico_audio: 249,
    full_premium: 319,
  });

  const router = useRouter();

const handleGoToNextStep = () => {
  const mensagemData = {
    from: isChecked ? 'Anônimo' : from || '',
    to: to || '',
    message: message || '',
    format: selectedFormat,
    price: prices[selectedFormat],
    cestaId: id || null,
    timestamp: Date.now(),
  };

  localStorage.setItem('mimo_mensagem', JSON.stringify(mensagemData));

  // Define o tipo de mídia necessário (se houver)
  let mediaType: 'audio' | 'video' | null = null;

  if (
    selectedFormat === 'digital_video' ||
    selectedFormat === 'full_premium'
  ) {
    mediaType = 'video';
  } else if (
    selectedFormat === 'digital_audio' ||
    selectedFormat === 'digital_fisico_audio'
  ) {
    mediaType = 'audio';
  }

  if (mediaType) {
    // Redireciona para a página de mídia com o tipo específico
    router.push(`/midia?tipo=${mediaType}`);
  } else {
    // Vai direto para entrega
    router.push('/entrega');
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Cartão de Mensagem
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Preencha os campos e escolha o formato de envio
          </p>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
            <MensagemPreview
              from={from}
              to={to}
              message={message}
              isChecked={isChecked}
            />

            <MensagemForm
              isChecked={isChecked}
              onToggleAnonimo={setIsChecked}
              from={from}
              to={to}
              message={message}
              onFromChange={setFrom}
              onToChange={setTo}
              onMessageChange={setMessage}
            />

            <FormatoSelector
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
              onPricesLoad={setPrices}
            />

            <div className="pt-2">
<button
  onClick={handleGoToNextStep}
  className="w-full font-semibold border border-red-900 text-white py-3 rounded-full hover:bg-red-800 bg-red-900 transition flex justify-center items-center gap-2"
>
  {prices[selectedFormat] === 0
    ? 'Continuar'
    : `Continuar — R$ ${prices[selectedFormat].toFixed(2)}`}
</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}