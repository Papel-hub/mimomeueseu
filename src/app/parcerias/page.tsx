'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParceirosCard from '@/components/ParceirosCard';

export default function ParceriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-35 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
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
      </main>

      <Footer />

      {/* Modal de formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center px-4 items-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Cadastro de Parceria
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome </label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Marco Morais"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="exemplo@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contato</label>
                <input
                  type="tel"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="(+99) 999-999-999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Produto</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Flores"
                />
              </div>

            <button
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 shadow-sm transition-all"
            >
              Confirmar pagamento
            </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
