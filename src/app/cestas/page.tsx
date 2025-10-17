'use client';

import React, { useState, useEffect } from 'react';
import CestasCard from '@/components/CestaCard';
import TabButton from '@/components/TabButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebaseConfig'; // ✅ Importa a instância global do Firestore
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/types/Product';

export default function CestasPage() {
  const [activeTab, setActiveTab] = useState('Romance');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Romance', 'Família & Amigos', 'Datas Especiais'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cestas'));

const lista = snapshot.docs
  .map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: typeof data.title === 'string' ? data.title : undefined,
      price: typeof data.price === 'number' ? data.price : undefined,
      rating: typeof data.rating === 'number' ? data.rating : undefined,
      image: typeof data.image === 'string' ? data.image : undefined,
      category: typeof data.category === 'string' ? data.category : undefined,
      video: typeof data.video === 'string' ? data.video : undefined,
      bestseller: data.bestseller === true,
    };
  })
  .filter((item) => item.title && item.image); // sem type guard

setProducts(lista as Product[]);

      } catch (err) {
        console.error('Erro ao buscar cestas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]); 

  const filteredProducts = products.filter((product) => product.category === activeTab);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cestas</h1>

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

        {/* Produtos */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Carregando Cestas...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <CestasCard
                key={product.id}
                id={product.id}
                title={product.title || 'Sem título'}
                price={product.price}
                rating={product.rating}
                image={product.image || '/images/p1.png'}
                bestseller={product.bestseller}
                showPrice={true}
                showViewDetails={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Nenhuma cesta encontrada nesta categoria.
          </p>
        )}

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