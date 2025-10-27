'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAuth, onAuthStateChanged, User, getIdToken } from 'firebase/auth';

// Componentes locais
import CartaoVisual from './components/CartaoVisual';
import AcoesCartao from './components/AcoesCartao';
import TransacoesSection from './components/TransacoesSection';
import DetalhesCartaoModal from './components/modais/DetalhesCartaoModal';
import MaisOpcoesModal from './components/modais/MaisOpcoesModal';

// Tipos
interface Transacao {
  id: string;
  descricao: string;
  data: string;
  tipo: 'recarga' | 'compra';
  valor: number;
}

export interface CartaoData {
  hasCartao: boolean;
  id: string;
  nome: string;
  cardNumber: string;
  validade?: string;
  cvv?: string;
  transacoes: Transacao[];
}

// Loading spinner
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
  const [token, setToken] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Checa autenticação
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser) {
        const idToken = await getIdToken(currentUser);
        setToken(idToken);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetcher usando token seguro
  const fetcher = async (url: string): Promise<CartaoData> => {
    if (!token) throw new Error('Não autenticado');
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(err.error || 'Falha na requisição');
    }
    return res.json();
  };

  // Só busca se token existir
  const { data: cartaoData, error, isLoading } = useSWR<CartaoData>(
    token ? '/api/user/cartao' : null,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  // Redireciona se não tiver cartão
  useEffect(() => {
    if (!isLoading && cartaoData && !cartaoData.hasCartao) {
      router.push('/solicitar-cartao');
    }
  }, [cartaoData, isLoading, router]);

  if (!authChecked || isLoading) return <LoadingSpinner />;

  if (!user) {
    router.push('/auth/login');
    return null;
  }

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

  if (!cartaoData?.hasCartao) return null;

  const handleAction = (action: string) => {
    alert(`Ação "${action}" não implementada ainda.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-900">Cartão (Gift Card)</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CartaoVisual nome={cartaoData.nome} cardNumber={cartaoData.cardNumber} />
            <AcoesCartao
              onShowDetails={() => setShowCardDetails(true)}
              onShowMore={() => setShowMoreOptions(true)}
              onAction={handleAction}
            />
          </div>

          <TransacoesSection transacoes={cartaoData.transacoes} />
        </div>
      </main>
      <Footer />

      <DetalhesCartaoModal
        isOpen={showCardDetails}
        onClose={() => setShowCardDetails(false)}
        cardNumber={cartaoData.cardNumber}
        validade={cartaoData.validade || '—'}
        cvv={cartaoData.cvv || '—'}
      />

      <MaisOpcoesModal
        isOpen={showMoreOptions}
        onClose={() => setShowMoreOptions(false)}
        onAction={(action) => {
          handleAction(action);
          setShowMoreOptions(false);
        }}
      />
    </div>
  );
}
