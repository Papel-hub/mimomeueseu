'use client';

import React, { useState, useEffect } from 'react';

import TabButton from '@/components/TabButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types/Product';

export default function ItensSupresaPage() {
  const [activeTab, setActiveTab] = useState('Romance');
  const [products, setProducts] = useState<Product[]>([]);


  const tabs = ['Produtos', 'Serviços'];


  const filteredProducts = products.filter((product) => product.category === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Itens Surpresa</h1>

        {/* Abas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>


        {/* Paginação (exemplo visual) */}
        <div className="flex justify-center mt-10 space-x-2">
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                page === 1
                  ? 'bg-red-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-800 hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}