// src/app/experiencias-mimo/categoria/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
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

  const category = categories.find(cat => cat.link === slug) as CategoryData | undefined;

  useEffect(() => {
    if (!category) {
      router.push('/experiencias-mimo');
    }
  }, [category, router]);

  if (!category) {
    return null; // ou loading
  }

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

        {/* Cabeçalho dinâmico */}
        <div className="container mx-auto px-4 py-6 mb-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Imagem */}
            <div className="md:w-1/3 flex-shrink-0">
              <Image
                src={category.image}
                alt={category.name}
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover w-full h-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/cartaouser.svg';
                }}
              />
            </div>
            {/* Texto */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{category.name}</h1>
              <p className="text-sm text-gray-600 mb-4">
                Preços entre: <strong>R$ {category.priceRange}</strong> | Experiências: <strong>{category.experienceCount}</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Lista de eventos filtrados */}
        <EventList
          onAdd={handleAdd}
          onGift={handleGift}
          category={slug}
        />
      </main>
      <Footer />
    </div>
  );
}