'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import TabButton from '@/components/TabButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebaseConfig';

interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  slug: string;
  category: string;
  video?: string;
}

export default function CestasPage() {
  const [activeTab, setActiveTab] = useState('Romance');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Romance', 'Família & Amigos', 'Datas Especiais'];
  const db = getFirestore(app);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [db]);

  const filteredProducts = products.filter(product => {
    if (activeTab === 'Romance') return product.category === 'Romance';
    if (activeTab === 'Família & Amigos') return product.category === 'Família & Amigos';
    if (activeTab === 'Datas Especiais') return product.category === 'Datas Especiais';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cestas</h1>

        {/* Abas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
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
          <p className="text-center text-gray-500 mt-10">Carregando produtos...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                rating={Math.round(product.rating)}
                image={product.image} // URL do VPS
                slug={product.slug}
                video={product.video}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">Nenhum produto encontrado nesta categoria.</p>
        )}

        {/* Paginação (exemplo visual) */}
        <div className="flex justify-center mt-10 space-x-2">
          {[1, 2, 3].map(page => (
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
