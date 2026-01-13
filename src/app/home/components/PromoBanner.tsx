'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, query } from 'firebase/firestore'; // 'query' adicionado
import { db } from '@/lib/firebaseConfig';

// Definindo a interface para melhor suporte ao TypeScript
interface Banner {
  id: string;
  imageUrl: string;
  link?: string;
}

export default function PromoBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Criando a query corretamente
        const bannersRef = collection(db, 'banners');
        const q = query(bannersRef);
        const snapshot = await getDocs(q);
        
        const bannerList = snapshot.docs.map(doc => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          ...doc.data()
        })) as Banner[];

        setBanners(bannerList);
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Timer para o carrossel automático
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Skeleton de carregamento ou estado vazio
  if (loading || banners.length === 0) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] lg:h-[490px] bg-gray-200 animate-pulse rounded-2xl mb-8 flex items-center justify-center">
        {!loading && banners.length === 0 && <span className="text-gray-400">Sem banner</span>}
      </div>
    );
  }

  return (
    <section className="relative w-full mb-8 group">
      {/* Container Principal da Imagem */}
{/* Container Principal: Mantém a proporção 1280/490 */}
<div className="relative w-full aspect-[1280/490] rounded-2xl overflow-hidden shadow-lg group">
  {banners[currentSlide]?.imageUrl ? (
    <Image
      src={banners[currentSlide].imageUrl}
      alt={`Banner promocional ${currentSlide + 1}`}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      priority
      sizes="100vw"
    />
  ) : (
    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
      Link da imagem inválido
    </div>
  )}

  {/* Overlay e Botão no Canto Inferior Direito */}
  <div className="absolute inset-0 p-4 sm:p-8 flex items-end justify-end">
    <Link 
      href="/cestas" 
      className="bg-white text-red-900 px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold shadow-xl 
                 hover:bg-red-50 transition-all duration-300 transform 
                 hover:-translate-y-1 active:scale-95 
                 animate-bounce-subtle"
    >
      Compre Agora
    </Link>
  </div>
</div>

      {/* Controles: Dots e Setas */}
      <div className="flex justify-between px-2 items-center mt-4">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide ? "bg-red-800 w-6" : "bg-red-200"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={prevSlide} 
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <button 
            onClick={nextSlide} 
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}