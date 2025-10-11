'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartaoStatus } from '@/hook/useCartaoStatus';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VerificarCartaoPage() {
  const router = useRouter();
  const { hasCartao, loading, error } = useCartaoStatus();

  useEffect(() => {
    if (!loading && !error) {
      if (hasCartao) {
        router.push('/cartao/meu-cartao');
      } else {
        router.push('/cartao/solicitar-cartao');
      }
    }
  }, [hasCartao, loading, error, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-rose-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Verificando seu cartão Mimo...</p>
        </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Erro ao verificar o cartão. Tente novamente.</p>
      </div>
    );
  }

  return null; // Redirecionamento ocorrerá automaticamente
}
