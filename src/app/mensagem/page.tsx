'use client';
import { useRouter, useParams } from "next/navigation";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from "next/image";
import { ArrowLeftIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

const product = {
  id: '1',
  title: 'Cesta Romântica Premium',
  price: 123.9,
};


export default function PersonalizarPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id as string; 

  const [isChecked, setIsChecked] = useState(true);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href={`/cestas/${id}`} className="text-red-900 hover:underline flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar para detalhes
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Cartão de Mensagem</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
            Preencha os campos abaixo para enviar um cartão junto a sua cesta
        </p>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">

        <h1 className="text-sm font-bold text-gray-900 text-center mb-2">Cartão de Mensagem</h1>
        <p className="text- text-gray-600 text-center mb-8">
            Preencha os campos abaixo para enviar um cartão junto a sua cesta
        </p>
                <div className="w-full h-full object-contain rounded-xl">
                  <Image
                    src="/images/carta.svg"
                    alt="Mimo Meu e Seu"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex justify-center items-center gap-3 font-sans">
      <label className="toggle-switch relative inline-block h-6 w-12 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`slider absolute inset-0 rounded-full transition-colors duration-300 ${
            isChecked ? 'bg-[#9e2121]' : 'bg-gray-300'
          }`}
        />
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
            isChecked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </label>
      <span className="text-sm text-gray-800 font-bold">Enviar de forma anônima</span>
    </div>

            <div className="border-t pt-6 mt-6">
                <label htmlFor="#">De:</label>
                <input
                    type="text"
                    placeholder="Digite o seu nome"
                    
                    className="w-full p-2 border border-gray-300 rounded-md mb-3"
                />
                <label htmlFor="#">Para:</label>
                <input
                    type="text"
                    
                    placeholder="Digite o nome se que deseja"
                    
                    className="w-full p-2 border border-gray-300 rounded-md mb-3"
                />
                <label htmlFor="#">Mensagem</label>
                <textarea 
                          placeholder="Escreva sua mensagem aqui" 
                          className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" rows={3} />

            <div className="space-y-3">
              <button
                className="w-full mt-4 flex items-center font-bold justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                <PlayCircleIcon className="h-5 w-5" />
                Ver video 3D + VR
              </button>
            </div>
          </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/checkout/${product.id}`)}
            className="w-full flex items-center bg-red-900 font-bold text-white justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-red-900 transition"
          >
            Ir para o carrinho
          </button>
          <Link
            href={`/cestas/${id}`}
            className="w-full flex items-center justify-center gap-2 font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>
        </div>
        </div>  
      </main>

      <Footer />
    </div>
  );
}
