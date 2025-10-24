'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Preços padrão (fallback)
const DEFAULT_PRICES = {
  digital: 10,
  fisico: 4,
  ambos: 4,
};

export default function MensagemPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<'digital' | 'fisico' | 'ambos'>('digital');

  // Estado apenas para os preços
  const [prices, setPrices] = useState(DEFAULT_PRICES);

  // Carregar preços do Firebase (sem loading UI)
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docRef = doc(db, 'config', 'mensagem');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Mesmo que falte um campo, mantém o fallback
          setPrices({
            digital: typeof data.digital === 'number' ? data.digital : DEFAULT_PRICES.digital,
            fisico: typeof data.fisico === 'number' ? data.fisico : DEFAULT_PRICES.fisico,
            ambos: typeof data.ambos === 'number' ? data.ambos : DEFAULT_PRICES.ambos,
          });
        }
      } catch (err) {
        console.warn('Falha ao carregar preços. Usando valores padrão.', err);
        // Não faz nada — já está com fallback
      }
    };

    fetchPrices();
  }, []);

 // adicione no topo do componente

const handleGoToEntrega = () => {
  const mensagemData = {
    from: isChecked ? 'Anônimo' : from || '',
    to: to || '',
    message: message || '',
    format: selectedFormat,
    price: prices[selectedFormat],
    timestamp: Date.now(),
  };

  // Salva no localStorage
  localStorage.setItem('mimo_mensagem', JSON.stringify(mensagemData));

  // Vai para a página de entrega
  router.push('/entrega');
};

  // Função para exibir nome amigável
  const getFormatLabel = (key: string) => {
    const labels: Record<string, string> = {
      digital: 'Formato digital',
      fisico: 'Formato físico',
      ambos: 'Formato digital e físico',
    };
    return labels[key] || key;
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
          {/* Visual da carta — ajustado para mobile */}
<div className="relative flex justify-center">
  <Image
    src="/images/cartae.svg"
    alt="Cartão de mensagem"
    width={500}
    height={500}
    className="w-full h-auto select-none"
  />

  {/* De: */}
  <div className="font-semibold absolute text-[10px] sm:text-xs
    top-[49%] sm:top-[50%] left-[13%] sm:left-[13%]
    w-[32%] sm:w-[31%] h-[5%]
    text-gray-500
    whitespace-pre-line break-words overflow-hidden leading-tight">
    {!isChecked && from ? from : 'Nome'}
  </div>

  {/* Para: */}
  <div className="font-semibold absolute text-[10px] sm:text-xs
    top-[54%] sm:top-[54.5%] left-[15%] sm:left-[15%]
    w-[30%] sm:w-[33%] h-[5%]
    text-gray-500
    whitespace-pre-line break-words overflow-hidden leading-tight">
    {to || 'Nome'}
  </div>

  {/* Mensagem: */}
  <div className="absolute text-[10px] sm:text-xs
    top-[62%] sm:top-[63%] left-[7%] sm:left-[8%]
    w-[36%] sm:w-[35%] text-gray-500 italic
    whitespace-pre-line break-words sm:max-h-[140px] max-h-[60px] 
    overflow-hidden leading-tight">
    {message || 'Sua mensagem...'}
  </div>
</div>

          {/* Anônimo */}
          <div className="flex justify-center items-center gap-3 font-sans">
            <label className="toggle-switch relative inline-block h-6 w-12 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer sr-only"
                aria-label="Enviar de forma anônima"
              />
              <span
                className={`slider absolute inset-0 rounded-full transition-colors duration-300 ${
                  isChecked ? 'bg-[#9e2121]' : 'bg-gray-300'
                }`}
              />
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                  isChecked ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </label>
            <span className="text-sm text-gray-800 font-bold">Enviar de forma anônima</span>
          </div>

          {/* Formatos */}
          <div className="border-t pt-4 mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800 text-center">Formato de envio</h2>
              <div className="grid grid-cols-1 gap-3">
                {(['digital', 'fisico', 'ambos'] as const).map((key) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === key
                        ? 'border-red-900 bg-red-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      checked={selectedFormat === key}
                      onChange={() => setSelectedFormat(key)}
                      className="sr-only"
                    />
                    <div className="flex-1 text-gray-800 font-medium">{getFormatLabel(key)}</div>
                    <div className="text-gray-600">
                      {typeof prices[key] === 'number' && prices[key] >= 0
                        ? prices[key] === 0
                          ? 'Grátis'
                          : `R$ ${prices[key].toFixed(2)}`
                        : '--'}
                    </div>
                  </label>
                ))}
              </div>
          </div>

          {/* Campos de texto */}
          <div className="space-y-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                De:
              </label>
              <input
                id="from"
                type="text"
                placeholder="Digite o seu nome"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                disabled={isChecked}
              />
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                Para:
              </label>
              <input
                id="to"
                type="text"
                placeholder="Digite o nome de quem deseja"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem:
              </label>
              <textarea
                id="message"
                placeholder="Escreva sua mensagem aqui..."
                className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Botão Comprar */}
          <div className="pt-2">
<button
  onClick={handleGoToEntrega}
  className="w-full font-semibold border border-red-900 text-white py-3 rounded-full hover:bg-red-800 bg-red-900 transition flex justify-center items-center gap-2"
>
  Continuar para entrega — R$ {prices[selectedFormat].toFixed(2)}
</button>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}