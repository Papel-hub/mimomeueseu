'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParceirosCard from '@/components/ParceirosCard';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebaseConfig'; // ← IMPORTADO
import { doc, getDoc } from 'firebase/firestore'; // ← IMPORTADO

export default function ParceriasPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCalendarAccess, setHasCalendarAccess] = useState(false);

  useEffect(() => {
    if (user) {
      const checkAccess = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setHasCalendarAccess(!!data?.googleCalendarTokens?.refreshToken);
        } catch (err) {
          console.error("Erro ao verificar acesso:", err);
        }
      };
      checkAccess();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar logado para agendar uma reunião.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const nomeEmpresa = formData.get('nomeEmpresa') as string;
    const email = formData.get('email') as string;
    const contato = formData.get('contato') as string;
    const produto = formData.get('produto') as string;

    // Validação simples
    if (!nomeEmpresa || !email || !contato || !produto) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Datas de exemplo: reunião em 3 dias, às 10h (Angola)
      const now = new Date();
      now.setDate(now.getDate() + 3);
      now.setHours(10, 0, 0, 0);
      const startTime = now.toISOString().replace('Z', '+01:00'); // Angola = UTC+1
      
      const endTime = new Date(now.getTime() + 60 * 60 * 1000) // +1h
        .toISOString()
        .replace('Z', '+01:00');

      const response = await fetch('/api/create-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Reunião de Parceria - ${nomeEmpresa}`,
          startTime,
          endTime,
          userId: user.uid, // ← ID do usuário do Firebase
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar reunião');
      }

      setMeetLink(data.meetLink);
      // Opcional: salvar dados da parceria no Firestore aqui
    } catch (err: unknown) {
  let errorMessage = 'Erro desconhecido';
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  }
  // Opcional: se você sabe que sua API pode retornar { message: string }
  // e o erro pode vir como objeto literal, adicione:
  else if (err && typeof err === 'object' && 'message' in err) {
    errorMessage = String((err as { message: unknown }).message);
  }

  setError(errorMessage);
}
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-35 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* ... conteúdo existente ... */}
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Parcerias</h1>
        <br />
        <p className="text-sm text-gray-600 text-center mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, provident sequi accusantium
          sapiente ducimus distinctio vel voluptate blanditiis eaque neque eum dolore quaerat quam nihil
          quibusdam, quos ea laudantium placeat. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          Ipsa, quae ullam natus corporis voluptates fugiat mollitia laudantium debitis laboriosam sapiente,
          earum maiores ratione illo aspernatur recusandae magni nemo ad ducimus.
        </p>

        <div className="bg-white p-6 max-w-2xl mx-auto mb-12">
          <button
          onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center font-bold bg-[#FCE1D0] text-[#F2A97A] justify-center rounded-full gap-2 p-3 hover:bg-red-50 transition"
          >
            Preencher formulário
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Nossos parceiros:</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ParceirosCard key={i} image="/images/p1.png" title="Cesta Romântica" />
            ))}
          </div>
        </div>

 {user && !hasCalendarAccess && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-center">
            <p className="text-yellow-800 mb-2">
              Para agendar reuniões, conecte sua conta do Google Calendar:
            </p>
            <a
              href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${
                process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
              }&redirect_uri=${encodeURIComponent(
                process.env.NEXT_PUBLIC_CALENDAR_CALLBACK || 'http://localhost:3000/api/calendar-callback'
              )}&scope=${encodeURIComponent(
                'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
              )}&response_type=code&access_type=offline&prompt=consent&state=${user.uid}`}
              className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Conectar Google Calendar
            </a>
          </div>
        )}
        
        {/* Modal de formulário */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center px-4 items-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg relative">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setMeetLink(null);
                  setError(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              {meetLink ? (
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Reunião Agendada!</h2>
                  <p className="text-gray-600 mb-4">
                    Sua reunião foi agendada para daqui a 3 dias às 10h (horário de Angola).
                  </p>
                  <a
                    href={meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {meetLink}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(meetLink);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Copiar link
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    Cadastro de Parceria
                  </h2>
                  {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                      <input
                        name="nomeEmpresa"
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="Ex: Ana Floricultura"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-mail</label>
                      <input
                        name="email"
                        type="email"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="exemplo@empresa.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contato</label>
                      <input
                        name="contato"
                        type="tel"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="(+244) 999 999 999"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Produto</label>
                      <input
                        name="produto"
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                        placeholder="Ex: Flores"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 shadow-sm transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? 'Agendando...' : 'Agendar reunião'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}