'use client';

import { useState, useEffect } from 'react';
import HeaderCont from '@/components/HeaderCont';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig';

export default function ContaPage() {
  const [activeTab, setActiveTab] = useState<'dados' | 'historico'>('dados');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  // 🔥 Carrega o usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <p>Carregando sua conta...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <HeaderCont />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Você não está logado
          </h1>
          <p className="text-gray-600 mb-6">
            Faça login para visualizar suas informações da conta.
          </p>
          <a
            href="/auth/login"
            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition"
          >
            Ir para Login
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderCont />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Cabeçalho da página */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Conta</h1>
        </div>

        {/* Cartão principal */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 mx-auto">

          {/* Foto de perfil */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&s=200'}
                alt="Avatar"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {user.displayName || 'Usuário sem nome'}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Abas */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium relative ${
                activeTab === 'dados' ? 'text-red-700' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('dados')}
            >
              Dados da Conta
              {activeTab === 'dados' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></div>
              )}
            </button>
            <button
              className={`px-4 py-2 font-medium relative ${
                activeTab === 'historico' ? 'text-red-700' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('historico')}
            >
              Histórico de Pedidos
              {activeTab === 'historico' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-700"></div>
              )}
            </button>
          </div>

          {/* Conteúdo da aba */}
          {activeTab === 'dados' && (
            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={user.displayName || ''}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    value="********"
                    readOnly
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  />
                  <button className="text-red-700 text-sm font-medium underline">
                    Alterar
                  </button>
                </div>
              </div>

              {/* Endereços (placeholder, pode puxar do Firestore depois) */}
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">
                Endereços Salvos
              </h2>
              <div>
                <input
                  type="text"
                  value="Nenhum endereço cadastrado"
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="py-12 text-center text-gray-500">
              <p>Em breve: Histórico de pedidos.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
