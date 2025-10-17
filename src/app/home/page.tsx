'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import CestasCard from '@/components/CestaCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/PromoBanner';
import { Product } from '@/types/Product';


export default function HomePage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // Controla exibição de mais itens

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cestas'));
        
        // Validação segura dos dados do Firestore
const lista = snapshot.docs
  .map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      title: typeof data.title === 'string' ? data.title : undefined,
      price: typeof data.price === 'number' ? data.price : undefined,
      rating: typeof data.rating === 'number' ? data.rating : undefined,
      image: typeof data.image === 'string' ? data.image : undefined,
      bestseller: data.bestseller === true, 
    };
  })
  .filter(item => item.title && item.image); // opcional: só mostra se tiver título e imagem

        setProdutos(lista);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const produtosParaExibir = showAll ? produtos : produtos.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <PromoBanner />

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Sugestões para você:
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-gray-600">Carregando cestas...</p>
            </div>
          ) : produtos.length === 0 ? (
            <div className="flex justify-center items-center h-80">
              <p className="text-gray-600">Nenhuma cesta encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

{produtosParaExibir.map((produto) => (
<CestasCard
  key={produto.id}
  id={produto.id}
  title={produto.title || 'Sem título'}
  price={produto.price}
  rating={produto.rating}
  image={produto.image || '/images/p1.png'}
  bestseller={produto.bestseller} 
  showPrice={false}        
  showViewDetails={false}   
/>
))}
            </div>
          )}
        </section>

        {!loading && produtos.length > 4 && !showAll && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-red-900 hover:underline font-medium cursor-pointer"
            >
              Ver mais →
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}