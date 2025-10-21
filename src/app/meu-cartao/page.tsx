'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getAuth, getIdToken } from 'firebase/auth'; // ← necessário para o token

interface Transacao {
  id: string;
  descricao: string;
  data: string;
  tipo: 'recarga' | 'compra';
  valor: number;
}

interface CartaoData {
  hasCartao: boolean;
  id: string;
  nome: string;
  cardNumber: string;
  transacoes: Transacao[];
}

// Fetcher com autenticação
const fetcher = async (url: string): Promise<CartaoData> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Não autenticado');

  const token = await getIdToken(user);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Falha na requisição');
  }

  return res.json();
};


const LoadingSpinner = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="min-h-screen flex items-center justify-center">

        <div className="animate-spin w-8 h-8 border-4 border-rose-600 rounded-full border-t-transparent">
          
        </div>
      </div>
      <Footer />
    </div>
);

export default function MeuCartaoPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Garantir que o código só rode no cliente (Firebase Auth)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: cartaoData, error, isLoading } = useSWR(
    isClient ? '/api/user/cartao' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  // Redireciona se não tiver cartão
  useEffect(() => {
    if (!isLoading && cartaoData && !cartaoData.hasCartao) {
      router.push('/cartao/solicitar-cartao');
    }
  }, [cartaoData, isLoading, router]);

  if (!isClient || isLoading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro ao carregar cartão.</div>;
  if (!cartaoData?.hasCartao) return null;

  const { nome, cardNumber, transacoes } = cartaoData;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Cartão</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          <div className="space-y-6">
          {/* Cartão visual */}
            <div className="relative flex justify-center mb-8">
              <Image
                src="/images/cartaouser.svg"
                alt="Cartão de mensagem"
                width={300}
                height={300}
                className="object-contain w-full max-w-xs select-none"
              />
              <div className="font-bold text-3xl text-white absolute top-[70%] left-[10%]
              text-gray-800   whitespace-pre-line break-words overflow-hidden">
                {nome}
              </div>
              <div className="font-semibold text-white text-xs absolute top-[80%]
              left-[10%] text-gray-800   whitespace-pre-line break-words overflow-hidden">
                {cardNumber}
              </div>
            </div>
            

          </div> 


        </div>

        {/* Transações */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Transações</h2>
          <div className="space-y-4">
            {transacoes && transacoes.length > 0 ? (
              transacoes.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{t.descricao}</p>
                    <p className="text-xs text-gray-500">{t.data}</p>
                  </div>
                  <span
                    className={`font-bold ${
                      t.tipo === 'recarga' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {t.tipo === 'recarga' ? '+' : '-'} R$ {Math.abs(t.valor).toFixed(2)}
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
      <Footer />
    </div>
  );
}