'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ResumoMensagem from './components/ResumoMensagem';
import EntregaDigitalSection from './components/EntregaDigitalSection';
import EntregaFisicaSection from './components/EntregaFisicaSection';
import EntregaMaoAmigaSection from './components/EntregaMaoAmigaSection';

// ⚠️ Substitua isso por verificação real (ex: Firebase auth + claims)
const useIsParceiro = (): boolean => {
  // Exemplo: verificar localStorage ou chamada à API
  return typeof window !== 'undefined' && localStorage.getItem('is_parceiro') === 'true';
};

export default function EntregaPage() {
  const router = useRouter();
  const isParceiro = useIsParceiro();

  const [digitalMethods, setDigitalMethods] = useState<string[]>([]);
  const [fisicaMethods, setFisicaMethods] = useState<string[]>([]);
  const [maoAmigaMethods, setMaoAmigaMethods] = useState<string[]>([]);

  const hasSelection = digitalMethods.length > 0 || fisicaMethods.length > 0 || maoAmigaMethods.length > 0;

  const handleContinue = () => {
    const entregaData = {
      digital: digitalMethods,
      fisica: fisicaMethods,
      maoAmiga: maoAmigaMethods,
      timestamp: Date.now(),
    };
    localStorage.setItem('mimo_entrega', JSON.stringify(entregaData));
    router.push('/pagamento');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-6 sm:px-12 pt-24 pb-10 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Escolha como Entregar
        </h1>

        <ResumoMensagem />

        <div className="max-w-2xl mx-auto space-y-6">
          <EntregaDigitalSection onSelect={setDigitalMethods} />
          <EntregaFisicaSection onSelect={setFisicaMethods} />
          <EntregaMaoAmigaSection
            isVisible={isParceiro}
            onSelect={setMaoAmigaMethods}
          />

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={handleContinue}
              disabled={!hasSelection}
              className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
                hasSelection
                  ? 'bg-red-900 hover:bg-red-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continuar para Pagamento
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3 px-4 rounded-full font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}