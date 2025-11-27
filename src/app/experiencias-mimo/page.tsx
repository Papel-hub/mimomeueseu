'use client';

import { useState } from 'react';
import GiftVoucherBanner from './components/GiftVoucherBanner';
import CategoryScrollMenu from './components/CategoryScrollMenu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventList from './components/EventList';

export default function ExperienciasMimoPage() {
  const categories = [
    { id: 1, link: 'natal', name: 'Natal 2025' },
    { id: 2, link: 'conducao-e-velocidade', name: 'Condução e Velocidade' },
    { id: 3, link: 'acao-e-adrenalina', name: 'Ação e Adrenalina' },
    { id: 4, link: 'aventura-e-viagem', name: 'Aventura e Viagem' },
    { id: 5, link: 'cuidados-e-relax', name: 'Cuidados e Relax' },
    { id: 6, link: 'workshops', name: 'Workshops' },
    { id: 7, link: 'presentes-personalizados', name: 'Presentes Personalizados' },
    { id: 8, link: 'vouchers-presente', name: 'Vouchers Presente' },
    { id: 9, link: 'sugestoes-para-ele', name: 'Sugestões para Ela/e' },
  ];

  // Opcional: lógica de add/gift (ex: integração com carrinho)
  const handleAdd = (eventId: string) => {
    console.log('Adicionar ao carrinho:', eventId);
  };

  const handleGift = (eventId: string) => {
    console.log('Presentear com:', eventId);
    // Você pode abrir um modal aqui, por exemplo
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <section className="mb-8">
          <CategoryScrollMenu categories={categories} />
        </section>

        <section className="mb-10">
          <GiftVoucherBanner
            title="Vouchers Presente | Golden Moments"
            subtitle="Preços entre: 25,00 - 1000,00"
            experiencesCount={16}
            description="Ofereça a alguém especial a oportunidade de escolher qual dos sonhos quer realizar com um voucher em valor ou um pack com várias experiências à escolha."
            ctaText="Veja as nossas sugestões clicando aqui"
            backgroundImageUrl="/images/cartaouser.svg"
          />
        </section>

        <h2 className="text-2xl font-bold text-center mb-8">
          As melhores prendas deste Natal
        </h2>

        {/* ✅ Componente de listagem isolado */}
        <EventList onAdd={handleAdd} onGift={handleGift} />
      </main>
      <Footer />
    </div>
  );
}