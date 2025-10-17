// app/pagamento/page.tsx
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import PagamentoForm from './PagamentoForm';

export default function PagamentoPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-center mb-6">
          <Link
            href="/carrinho"
            className="text-red-900 hover:underline flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar para o carrinho
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Pagamento
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Escolha uma forma de pagamento e finalize seu pedido.
        </p>

        <Suspense fallback={<div className="max-w-lg mx-auto p-8">Carregando opções de pagamento...</div>}>
          <PagamentoForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}