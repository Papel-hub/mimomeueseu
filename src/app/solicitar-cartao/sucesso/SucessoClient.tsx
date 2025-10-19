'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function SucessoSolicitacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');
  const modo = searchParams.get('modo');

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const activateCard = async () => {
      if (tipo === 'digital' && modo === 'proprio') {
        try {
          const token = await auth.currentUser?.getIdToken();
          if (!token) return;

          const res = await fetch('/api/activate-card', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) {
            console.error('Falha ao ativar cartão');
          }
        } catch (err) {
          console.error('Erro na ativação:', err);
        }
      }
    };

    activateCard();
  }, [tipo, modo]);

  const isPresente = modo === 'presente';
  const isFisico = tipo === 'fisico';

  const handleGoToCard = () => {
    if (isPresente) {
      router.push('/');
    } else if (isFisico) {
      router.push('/meus-pedidos');
    } else {
      router.push('/cartao/meu-cartao');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6 mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {isPresente
              ? isFisico
                ? 'Presente físico enviado!'
                : 'Presente digital enviado!'
              : isFisico
              ? 'Cartão físico solicitado!'
              : 'Cartão digital ativado!'}
          </h1>

          <div className="text-gray-600 mb-6 space-y-2">
            {isFisico ? (
              <>
                <p>
                  {isPresente
                    ? 'Seu presente físico está sendo preparado com carinho!'
                    : 'Seu cartão físico está sendo produzido com material premium.'}
                </p>
                <p>
                  <span className="font-medium">Prazo de entrega:</span> 7 a 10 dias úteis.
                </p>
                <p className="text-sm text-gray-500">
                  Frete grátis para todo o Brasil 🇧🇷
                </p>
              </>
            ) : (
              <>
                <p>
                  {isPresente
                    ? 'Seu presente digital foi enviado com sucesso!'
                    : 'Seu cartão digital está pronto para uso!'}
                </p>
                <p className="text-sm text-gray-500">
                  {isPresente
                    ? 'O destinatário receberá um e-mail com o link de acesso.'
                    : 'Acesse seu cartão a qualquer momento no app ou site.'}
                </p>
              </>
            )}
          </div>

          {!isPresente && userEmail && (
            <p className="text-sm text-gray-500 mb-6">
              Enviado para: <span className="font-mono">{userEmail}</span>
            </p>
          )}

          <button
            onClick={handleGoToCard}
            className="w-full max-w-xs mx-auto bg-rose-600 text-white py-3 px-6 rounded-full font-medium hover:bg-rose-700 transition-colors"
          >
            {isPresente
              ? 'Voltar para a home'
              : isFisico
              ? 'Acompanhar meu pedido'
              : 'Ir para meu cartão'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
