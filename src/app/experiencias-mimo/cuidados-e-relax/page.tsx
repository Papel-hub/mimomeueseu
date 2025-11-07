'use client'; // Para usar interatividade (botões, mapa, etc.)

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryScrollMenu from '../components/CategoryScrollMenu';

export default function CuidadosRelaxPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const categories = [
    { id: 1, link: 'natal', name: "Natal 2025" },
    { id: 2, link: 'conducao-e-velocidade', name: "Condução e Velocidade" },
    { id: 3, link: 'acao-e-adrenalina', name: "Ação e Adrenalina" },
    { id: 4, link: 'aventura-e-viagem', name: "Aventura e Viagem" },
    { id: 5, link: 'cuidados-e-relax', name: "Cuidados e Relax" },
    { id: 6, link: 'workshops', name: "Workshops" },
    { id: 7, link: 'presentes-personalizados', name: "Presentes Personalizados" },
    { id: 8, link: 'vouchers-presente', name: "Vouchers Presente" },
    { id: 9, link: 'sugestoes-para-ele', name: "Sugestões p/ Ele" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Menu de categorias */}
        <section className="mb-8">
         <CategoryScrollMenu categories={categories} />
        </section>
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Aventura e Viagem</h1>
          <p className="text-sm text-gray-600 mb-4">
            Preços entre: <strong>R$ 25,00  - 7200,00 </strong> | Experiências: <strong>320</strong>
          </p>
          <p className="text-gray-700 leading-relaxed">
            Agarre o volante e acelere a fundo numa das nossas experiências de condução e velocidade. 
            Escolha o seu carro super desportivo preferido e realize um dos seus sonhos. Sinta o roncar 
            inconfundível de um motor Ferrari ou a estabilidade inigualável de um Lamborghini e deixe 
            um rasto de pneu queimado no alcatrão.
          </p>
        </div>

        {/* Imagem */}
        <div className="md:w-1/3">
          <Image
            src="/images/ferrari-race.jpg" // Substitua pelo caminho real da sua imagem
            alt="Carros esportivos em pista"
            width={400}
            height={300}
            className="rounded-lg shadow-md object-cover w-full h-auto"
          />
        </div>
      </div>

      {/* Botões de navegação */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            viewMode === 'list'
              ? 'bg-gray-200 text-gray-800'
              : 'bg-white text-gray-600 border border-gray-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          ver lista
        </button>

        <button
          onClick={() => setViewMode('map')}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            viewMode === 'map'
              ? 'bg-gray-200 text-gray-800'
              : 'bg-white text-gray-600 border border-gray-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.995 1.995 0 01-2.828 0l-4.244-4.244a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          ver mapa
        </button>

        <button className="px-4 py-2 rounded-md bg-white text-gray-600 border border-gray-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9.224 12.6 9.6 12.6H18.75c.486 0 .824.338 1.026.742l7.129 14.258a1.5 1.5 0 01-1.026.969H7.984c-.486 0-.824.338-1.026.742L6.958 21.5a1.5 1.5 0 01-1.026.969H5.7a1.5 1.5 0 01-1.026-.969L4.674 14.258A1.5 1.5 0 015.7 12.6h12.984c.376 0 .714-.338.916-.742z" />
          </svg>
        </button>
      </div>

      {/* Campo de pesquisa por localização */}
      {viewMode === 'map' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquise por localização"
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Mapa (simulado) */}
      {viewMode === 'map' && (
        <div className="relative h-80 bg-blue-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <p>Mapa interativo aqui </p>
          </div>
          {/* Ícone de fullscreen no canto inferior direito */}
          <button className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0H8m-4 4l5-5 5 5M4 16v4m0-4h4m-4 4l5 5 5-5" />
            </svg>
          </button>
        </div>
      )}

      {/* Conteúdo da lista (simulado) */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold">Ferrari F8 Tributo Experience</h3>
            <p className="text-sm text-gray-600">Braga • 250</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold">Lamborghini Huracán Track Day</h3>
            <p className="text-sm text-gray-600">Portimão • 7200</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold">Porsche GT3 RS Circuit Tour</h3>
            <p className="text-sm text-gray-600">Estoril • 1500</p>
          </div>
        </div>
      )}
    </div>
          </main>
          <Footer />
        </div>
  );
}