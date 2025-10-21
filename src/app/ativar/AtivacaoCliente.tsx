'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseConfig';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

type CardData = {
  cardNumber: string;
  pin: string;
  nome: string;
  tipo: 'fisico' | 'digital';
  modo: 'proprio' | 'presente';
};

export default function AtivacaoCliente({
  token,
  uid,
  giftId,
}: {
  token: string | null;
  uid: string | null;
  giftId: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [card, setCard] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de ativação não fornecido.');
      setStatus('error');
      return;
    }

    if (!uid && !giftId) {
      setError('Link inválido.');
      setStatus('error');
      return;
    }

    const activate = async () => {
      setStatus('loading');

      try {
        let docRef;
        let docSnap;

        if (uid) {
          const userQuery = query(
            collection(db, 'users'),
            where('card.activationToken', '==', token)
          );
          const userDocs = await getDocs(userQuery);
          if (userDocs.empty) throw new Error('Token inválido.');
          docRef = doc(db, 'users', userDocs.docs[0].id);
          docSnap = userDocs.docs[0];
        } else if (giftId) {
          const giftQuery = query(
            collection(db, 'gifts'),
            where('activationToken', '==', token)
          );
          const giftDocs = await getDocs(giftQuery);
          const matchingDoc = giftDocs.docs.find(d => d.id === giftId);
          if (!matchingDoc) {
            throw new Error('Token ou ID do presente inválido.');
          }
          docRef = doc(db, 'gifts', giftId);
          docSnap = matchingDoc;
        } else {
          throw new Error('Dados insuficientes.');
        }

        const data = docSnap.data();
        if (!data) throw new Error('Dados do cartão não encontrados.');

        const expiresAt = new Date(data.activationExpiresAt);
        if (expiresAt < new Date()) {
          throw new Error('Este link de ativação expirou.');
        }

        const updateData = uid
          ? { 'card.status': 'active', 'card.activationToken': null }
          : { status: 'active', activationToken: null };

        await updateDoc(docRef, updateData);

        const cardData = uid ? data.card : data;
        setCard({
          cardNumber: cardData.cardNumber,
          pin: cardData.pin,
          nome: cardData.nome,
          tipo: cardData.tipo,
          modo: cardData.modo,
        });
        setStatus('success');
      } catch (err) {
        console.error('Erro ao ativar cartão:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Não foi possível ativar o cartão.');
        }
        setStatus('error');
      }
    };

    activate();
  }, [token, uid, giftId]);

  // ... (mesmo JSX do seu componente original, a partir do return)
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {status === 'success' ? 'Cartão Ativado!' : 'Ativando seu cartão...'}
            </h1>

            {status === 'loading' && (
              <div className="flex flex-col items-center py-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-r-transparent mb-4"></div>
                <p className="text-gray-600">Verificando token e ativando seu cartão...</p>
              </div>
            )}

            {status === 'error' && (
              <div className="py-6">
                <div className="text-red-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 text-rose-600 font-medium hover:underline"
                >
                  Voltar à página inicial
                </button>
              </div>
            )}

            {status === 'success' && card && (
              <div className="py-6 space-y-6">
                <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg p-5">
                  <p className="text-sm opacity-90">Número do cartão</p>
                  <p className="text-xl font-mono tracking-wider font-bold">{card.cardNumber}</p>
                </div>

                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">PIN de ativação</p>
                  <p className="text-2xl font-bold font-mono text-gray-900">{card.pin}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Guarde esse PIN em local seguro. Ele não será exibido novamente.
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Seu cartão {card.tipo === 'fisico' ? 'físico' : 'digital'} está ativo!
                    {card.modo === 'presente' && ' Aproveite o presente!'}
                  </p>
                </div>

                <button
                  onClick={() => router.push('/meu-cartao')}
                  className="w-full mt-4 bg-rose-600 text-white py-3 rounded-full font-medium hover:bg-rose-700 transition"
                >
                  Acessar meu cartão
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}