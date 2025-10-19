'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartaoStatus } from '@/hook/useCartaoStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VerificarCartaoPage() {
  const router = useRouter();
  const { hasCartao, loading, error } = useCartaoStatus();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !error && !redirecting) {
      setRedirecting(true);
      if (hasCartao) {
        router.push('/meu-cartao');
      } else {
        router.push('/solicitar-cartao');
      }
    }
  }, [hasCartao, loading, error, redirecting, router]);

  const handleRetry = () => {
    // Força refetch no hook (se seu hook tiver essa funcionalidade)
    // Ou recarrega a página
    window.location.reload();
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h2>
            <p className="text-gray-600 mb-6">
              Não foi possível verificar seu cartão no momento.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mostra spinner enquanto carrega OU enquanto redireciona
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">
            {redirecting
              ? 'Redirecionando...'
              : 'Verificando seu cartão Mimo...'}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}