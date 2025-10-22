'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, User, getIdToken } from 'firebase/auth';

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
      <div className="animate-spin w-8 h-8 border-4 border-rose-600 rounded-full border-t-transparent" />
    </div>
    <Footer />
  </div>
);

export default function MeuCartaoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Espera o Firebase resolver o estado de autenticação
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Só faz a requisição se o usuário estiver autenticado
  const shouldFetch = authChecked && !!user;

  const { data: cartaoData, error, isLoading } = useSWR(
    shouldFetch ? '/api/user/cartao' : null,
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

  // Enquanto verifica autenticação ou carrega
  if (!authChecked || isLoading) {
    return <LoadingSpinner />;
  }

  // Se não estiver autenticado, redireciona ou mostra erro
  if (!user) {
    router.push('/login');
    return null;
  }

  // Se houver erro na API (ex: token inválido, Firestore indisponível)
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500 px-4 text-center">
          <p className="text-lg font-medium">Não foi possível carregar seu cartão.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
          >
            Tentar novamente
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Caso não tenha cartão (embora o SWR não deva retornar isso se hasCartao=false, pois redireciona)
  if (!cartaoData?.hasCartao) {
    return null;
  }

  const { nome, cardNumber, transacoes } = cartaoData;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Cartão</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="relative flex justify-center mb-8">
              <Image
                src="/images/cartaouser.svg"
                alt="Cartão de mensagem"
                width={300}
                height={300}
                className="object-contain w-full max-w-xs select-none"
              />
              <div className="font-bold text-3xl text-gray-800 absolute top-[70%] left-[10%] whitespace-pre-line break-words overflow-hidden">
                {nome}
              </div>
              <div className="font-semibold text-gray-800 text-xs absolute top-[80%] left-[10%] whitespace-pre-line break-words overflow-hidden">
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