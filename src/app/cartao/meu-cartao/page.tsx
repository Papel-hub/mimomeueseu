'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import QRCode from 'react-qr-code';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Card from '@/components/Card';


interface Transacao {
  id: string;
  descricao: string;
  data: string;
  tipo: 'recarga' | 'compra';
  valor: number;
}


const fetcher = (url: string) => fetch(url).then(res => res.json());

const nivelColors: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-800',
  Prata: 'bg-gray-100 text-gray-800',
  Ouro: 'bg-yellow-100 text-yellow-800',
  Diamante: 'bg-blue-100 text-blue-800',
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-rose-600 rounded-full border-t-transparent"></div>
  </div>
);

export default function MeuCartaoPage() {
  const router = useRouter();
  const { data: cartaoData, error, isLoading } = useSWR('/api/user/cartao', fetcher);

  useEffect(() => {
    if (!isLoading && cartaoData && !cartaoData.hasCartao) {
      router.push('/cartao/solicitar-cartao');
    }
  }, [cartaoData, isLoading, router]);

if (isLoading) return <LoadingSpinner />;
if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro ao carregar cartão.</div>;
if (!cartaoData?.hasCartao) return null; // redirecionamento

  const { id, nivel, transacoes } = cartaoData;


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header fixo */}
          <Header />
                <main className="flex-grow px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cartão (Gift Card)</h1>


        {/* Saldo e QR Code */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
            <Card/>

          <div className="bg-gradient-to-r from-rose-700 to-rose-900 p-6 text-white">
            <h2 className="text-xl font-semibold">Saldo Disponível</h2>
            <p className="text-4xl font-bold mt-2">R$ {cartaoData.saldo?.toFixed(2)}</p>

            <p className="text-rose-200 text-sm mt-1">ID: {id}</p>
          </div>

          <div className="p-2 flex flex-col items-center">
            <QRCode value={`MIMO:${id}`} size={192} />


            <p className="text-gray-600 text-sm text-center max-w-xs">
              Apresente este QR Code em lojas físicas ou parceiros para pagar com seu saldo.
            </p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => router.push('cartao/meu-cartao/recarregar')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-4 rounded-xl shadow-sm transition-colors"
          >
            💰 Recarregar Saldo
          </button>
          <button
            onClick={() => router.push('cartao/solicitar-cartao')}
            className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-medium py-4 rounded-xl shadow-sm transition-colors"
          >
            🎁 Presentear Alguém
          </button>
        </div>

        {/* Fidelidade */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Meus Benefícios</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">Nível {nivel}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${nivelColors[nivel]}`}>
              {nivel}
            </span>
          </div>
          <div>
          </div>
          <p className="text-gray-600 text-sm mt-3">
            Cada R$1 gasto = 10 pontos. Troque por descontos, brindes e experiências exclusivas.
          </p>
        </div>

{/* Histórico de Transações */}
<div className="bg-white rounded-2xl shadow-md p-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Transações</h2>
  <div className="space-y-4">
    {(transacoes ?? []).length > 0 ? (
      (transacoes ?? []).map((t: Transacao) => (
  <div key={t.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="font-medium text-gray-800">{t.descricao}</p>
      <p className="text-xs text-gray-500">{t.data}</p>
    </div>
    <span className={`font-bold ${t.tipo === 'recarga' ? 'text-green-600' : 'text-red-600'}`}>
      {t.tipo === 'recarga' ? '+' : '-'} R$ {Math.abs(t.valor ?? 0).toFixed(2)}
    </span>
  </div>
))

    ) : (
      <p className="text-gray-500 text-sm">Nenhuma transação encontrada.</p>
    )}
  </div>
  <button className="mt-4 text-rose-600 hover:underline text-sm font-medium">
    Ver todo o histórico
  </button>
</div>
</main>
{/* Footer */}
      <Footer />
      </div>
      
    
  );
}
