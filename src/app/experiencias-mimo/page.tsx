// app/experiencias-mimo/page.tsx
'use client';

import GiftCard from './components/GiftCard';
import GiftVoucherBanner from './components/GiftVoucherBanner';
import CategoryScrollMenu from './components/CategoryScrollMenu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Gift {
  id: number;
  title: string;
  priceRange: string;
  experiences: number;
  imageUrl: string;
  isFavorite: boolean;
}

export default function ExperienciasMimoPage() { // ✅ Corrigido aqui
  const categories = [
    { id: 1, link: 'natal', name: "Natal 2025" },
    { id: 2, link: 'conducao-e-velocidade', name: "Condução e Velocidade" },
    { id: 3, link: 'acao-e-adrenalina', name: "Ação e Adrenalina" },
    { id: 4, link: 'aventura-e-viagem', name: "Aventura e Viagem" },
    { id: 5, link: 'cuidados-e-relax', name: "Cuidados e Relax" },
    { id: 6, link: 'workshops', name: "Workshops" },
    { id: 7, link: 'presentes-personalizados', name: "Presentes Personalizados" },
    { id: 8, link: 'vouchers-presente', name: "Vouchers Presente" },
    { id: 9, link: 'sugestoes-para-ele', name: "Sugestões para Ela/e" },
  ];

  const gifts: Gift[] = [
    {
      id: 1,
      title: "Prendas para Ele",
      priceRange: "R$25,00 - R$6329,00",
      experiences: 112,
      imageUrl: "/images/cartaouser.svg",
      isFavorite: true,
    },
    // Adicione mais gifts conforme necessário
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Menu de categorias */}
        <section className="mb-8">
         <CategoryScrollMenu categories={categories} />
        </section>

        {/* Banner de vouchers */}
        <section className="mb-10">
          <GiftVoucherBanner
            title="Vouchers Presente | Golden Moments"
            subtitle="Preços entre: 25,00 € - 1000,00 €"
            experiencesCount={16}
            description="Ofereça a alguém especial a oportunidade de escolher qual dos sonhos quer realizar com um voucher em valor ou um pack com várias experiências à escolha."
            ctaText="Veja as nossas sugestões clicando aqui"
            backgroundImageUrl="/images/cartaouser.svg"
          />
        </section>

        {/* Título e cards de presentes */}
        <h2 className="text-2xl font-bold text-center mb-8">As melhores prendas deste Natal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <GiftCard
              key={gift.id}
              title={gift.title}
              priceRange={gift.priceRange}
              experiences={gift.experiences}
              imageUrl={gift.imageUrl}
              isFavorite={gift.isFavorite}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}