// src/app/experiencias-mimo/categoria/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventList from '../../components/EventList';
import CategoryScrollMenu from '../../components/CategoryScrollMenu';
import { categories, CategoryData } from '../../data/categories';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const category = categories.find(cat => cat.link === slug) as
    | CategoryData
    | undefined;

  // --- STATES ---
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mainMedia, setMainMedia] = useState<string | null>(null);

  // --- REDIRECIONA SE NÃO EXISTIR ---
  useEffect(() => {
    if (!category) {
      router.push('/experiencias-mimo');
    }
  }, [category, router]);

  if (!category) return null;

  // Garante que category.image sempre seja array
  const imagesArray = Array.isArray(category.image)
    ? category.image
    : [category.image];

  // --- CLIQUE NAS MINIATURAS ---
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setMainMedia(null);
  };

  const handleAdd = (eventId: string) => {
    console.log('Adicionar ao carrinho:', eventId);
  };

  const handleGift = (eventId: string) => {
    console.log('Presentear com:', eventId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Menu de categorias */}
        <section className="mb-8">
          <CategoryScrollMenu categories={categories} />
        </section>

        {/* Header da categoria */}
        <div className="container mx-auto px-4 py-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">

            {/* Galeria */}
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-3 items-center">
                {/* Miniatura do vídeo */}
                {category.video && (
                  <button
                    onClick={() => setMainMedia(category.video!)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      mainMedia === category.video
                        ? 'border-green-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="bg-black text-white text-xs flex items-center justify-center w-full h-full">
                      ▶️
                    </div>
                  </button>
                )}

                {/* Miniaturas das imagens */}
                {imagesArray.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      !mainMedia && selectedImageIndex === idx
                        ? 'border-green-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>

              {/* Mídia principal */}
              <div className="bg-gray-100 rounded-xl flex items-center justify-center w-full max-w-[500px] max-h-[425px]">
                {mainMedia ? (
                  <video
                    src={mainMedia}
                    controls
                    className="w-full h-full object-contain rounded-xl"
                    poster={imagesArray[0]}
                  />
                ) : (
                  <Image
                    src={imagesArray[selectedImageIndex]}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="object-contain rounded-lg shadow-md w-full h-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/images/cartaouser.svg';
                    }}
                  />
                )}
              </div>
            </div>

            {/* Texto */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{category.name}</h1>
              <p className="text-sm text-gray-600 mb-4">
                Preços entre: <strong>R$ {category.priceRange}</strong> | Experiências:{' '}
                <strong>{category.experienceCount}</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de eventos */}
        <EventList onAdd={handleAdd} onGift={handleGift} category={slug} />
      </main>

      <Footer />
    </div>
  );
}
