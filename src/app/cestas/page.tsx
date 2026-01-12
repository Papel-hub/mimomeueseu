'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import CestasCard from '@/components/CestaCard';
import TabButton from '@/components/TabButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types/Product';

// --- SKELETON PARA LISTAGEM ---
const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

// --- CATEGORIAS ---
const TABS = [
  'Todos',
  'Românticas / Amor e Relacionamentos',
  'Bebês e Maternidade',
  'Festividades e Datas Especiais',
  'Agradecimento / Reconhecimento',
  'Amizade / Social',
  'Corporativa / Profissional',
  'Despedidas / Celebrações de Ciclos',
  'Saúde e Bem-estar',
  'Temáticas Especiais',
];

// --- FETCHER ---
const fetchAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'cestas'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;

    return {
      id: doc.id,
      title: data.title || 'Sem título',
      price: data.price || 0,
      rating: data.rating || 0,
      image: imageUrl?.trim() || '/images/placeholder.png',
      category: data.category || 'Outros',
      bestseller: !!data.bestseller,
    } as Product;
  });
};

export default function CestasPage() {
  const [activeTab, setActiveTab] = useState('Todos');

  const { data: products, error, isLoading } = useSWR('cestas/all', fetchAllProducts, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // Filtragem em tempo real no cliente (eficiente para listas de até ~200 itens)
  const filteredProducts = products?.filter((product) => 
    activeTab === 'Todos' ? true : product.category === activeTab
  ) || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-16 pt-24 pb-12 sm:pt-28">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Nossas Cestas</h1>

        {/* Container de Abas com Scroll Horizontal no Mobile */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar scroll-smooth">
          {TABS.map((tab) => (
            <div key={tab} className="flex-shrink-0">
              <TabButton
                label={tab}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            </div>
          ))}
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full text-center py-20 text-red-600">
              Erro ao carregar os produtos. Por favor, tente novamente.
            </div>
               ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
              <CestasCard
                key={product.id}
                id={product.id}
                title={product.title ?? 'Cesta Sem Título'} // ✅ Garante que nunca seja undefined
                image={product.image ?? '/images/placeholder.png'} // ✅ Garante que nunca seja undefined
                price={product.price}
                rating={product.rating}
                bestseller={product.bestseller}
                showPrice={true}
                showViewDetails={true}
              />
            ))
            
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhuma cesta encontrada em {activeTab}.</p>
              <button 
                onClick={() => setActiveTab('Todos')}
                className="mt-4 text-red-700 font-semibold hover:underline"
              >
                Ver todos os produtos
              </button>
            </div>
          )}
        </div>

        {/* Paginação Estática (Remover se usar Infinite Scroll no futuro) */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex justify-center mt-12 space-x-2">
            {[1].map((page) => (
              <button
                key={page}
                className="w-10 h-10 rounded-lg font-medium bg-red-900 text-white"
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}