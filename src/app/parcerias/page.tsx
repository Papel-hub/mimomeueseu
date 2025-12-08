'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import ParceirosCard from '@/components/ParceirosCard';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';

export default function ParceriasPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setHasCalendarAccess] = useState(false);
  const [contato, setContato] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const checkAccess = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setHasCalendarAccess(!!data?.googleCalendarTokens?.refreshToken);
        } catch (err) {
          console.error('Erro ao verificar acesso:', err);
        }
      };
      checkAccess();
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const nomeEmpresa = formData.get('nomeEmpresa') as string;
    const email = formData.get('email') as string;
    const produto = formData.get('produto') as string;

    if (!nomeEmpresa || !email || !contato || !produto) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    router.push(
      `/agendar?nomeEmpresa=${encodeURIComponent(nomeEmpresa)}&email=${encodeURIComponent(
        email
      )}&contato=${encodeURIComponent(contato)}&produto=${encodeURIComponent(produto)}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-35 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Parcerias</h1>
        <br />
        <p className="text-sm text-gray-600 text-center mb-8">
          A Mimo Meu e Seu está abrindo espaço para parcerias que realmente transformam momentos em memórias inesquecíveis.
          Se você oferece produtos, serviços ou experiências que despertam emoção, cuidado e encantamento, queremos você ao nosso lado.
          Nossos clientes procuram presentes que criam histórias — e o seu negócio pode fazer parte de cada uma delas. 
          Ao se tornar parceiro, seus produtos ou serviços ganham visibilidade, valor agregado e se transformam em experiências únicas dentro de nossas Caixas Mimo e em nossos eventos especiais.
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

        {/* Modal */}
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
                      <PhoneInput
                        country={'br'}
                        value={contato}
                        onChange={(value) => setContato(value)}
                        inputProps={{
                          name: 'contato',
                          required: true,
                        }}
                        inputStyle={{
                          width: '100%',
                          borderRadius: '0.5rem',
                          borderColor: '#d1d5db',
                          height: '42px',
                        }}
                        buttonStyle={{
                          borderColor: '#d1d5db',
                          borderTopLeftRadius: '0.5rem',
                          borderBottomLeftRadius: '0.5rem',
                        }}
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
                    <div className="border rounded-lg py-10 items-center justify-center bg-gray-400">
                      video de publicidade
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
