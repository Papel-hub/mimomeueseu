'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import CestasCard from '@/components/CestaCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBanner from './components/PromoBanner';
import { Product } from '@/types/Product';

// --- SKELETON COMPONENT ---
const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

// --- INTERFACE PARA O RETORNO DO FETCHER ---
interface HomeData {
  produtos: Product[];
  limiteExibicao: number;
}

// --- FETCHER UNIFICADO ---
const fetchHomeData = async (): Promise<HomeData> => {
  // 1. Busca a configuração de limite definida no Painel (coleção 'configuracoes', doc 'home')
  let limiteCards = 4; // Valor padrão de fallback
  try {
    const configRef = doc(db, 'configuracoes', 'home');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      limiteCards = configSnap.data().limiteCards || 4;
    }
  } catch (err) {
    console.error("Erro ao buscar configurações do painel:", err);
  }

  // 2. Busca os produtos respeitando o limite do painel
  const q = query(collection(db, 'cestas'), limit(limiteCards)); 
  const snapshot = await getDocs(q);
  
  const produtos = snapshot.docs.map(doc => {
    const data = doc.data();
    const imageUrl = Array.isArray(data.image) 
      ? data.image[0]?.trim() 
      : typeof data.image === 'string' 
        ? data.image.trim() 
        : undefined;

    return {
      id: doc.id,
      title: data.title,
      price: data.price,
      rating: data.rating,
      image: imageUrl,
      bestseller: !!data.bestseller,
    } as Product;
  }).filter(item => item.title && item.image);

  return { produtos, limiteExibicao: limiteCards };
};

export default function HomePage() {
  const { data, error, isLoading } = useSWR<HomeData>('home/data', fetchHomeData, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, 
  });

  const produtos = data?.produtos;
  const limite = data?.limiteExibicao || 4;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-16 pt-24 pb-12 sm:pt-28">
        {/* Banner controlado via Firebase dentro do componente */}
        <PromoBanner />

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Sugestões para você:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Mostra skeletons baseados no limite esperado
              Array.from({ length: limite }).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)
            ) : error ? (
              <div className="col-span-full text-center py-10 text-red-500">
                Ocorreu um erro ao carregar o conteúdo.
              </div>
            ) : produtos?.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                Nenhuma cesta encontrada no momento.
              </div>
            ) : (
              produtos?.map((produto) => (
                <CestasCard
                  key={produto.id}
                  id={produto.id}
                  title={produto.title || 'Cesta Especial'}
                  price={produto.price}
                  rating={produto.rating}
                  image={produto.image || '/images/placeholder.png'}
                  bestseller={produto.bestseller} 
                  showPrice={true}         
                  showViewDetails={false}   
                />
              ))
            )}
          </div>
        </section>

        {/* Botão de navegação aparece apenas se houver produtos */}
        {!isLoading && produtos && produtos.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              href="/cestas"
              className="inline-block px-8 py-3 bg-white border border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              Ver todas as cestas →
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}