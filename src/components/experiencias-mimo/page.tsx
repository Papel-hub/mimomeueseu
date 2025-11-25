'use client';

import { useEffect, useState } from "react";

import GiftCard from "./components/GiftCard";
import GiftVoucherBanner from "./components/GiftVoucherBanner";
import CategoryScrollMenu from "./components/CategoryScrollMenu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Gift {
  id: string;
  title: string;
  priceRange: string;
  experiences: number;
  imageUrl: string;
  isFavorite: boolean;
}

interface EventbriteEvent {
  id: string;
  name?: {
    text?: string;
  };
  logo?: {
    url?: string;
  } | null;
}

export default function ExperienciasMimoPage() {
  const categories = [
    { id: 1, link: "natal", name: "Natal 2025" },
    { id: 2, link: "conducao-e-velocidade", name: "Condução e Velocidade" },
    { id: 3, link: "acao-e-adrenalina", name: "Ação e Adrenalina" },
    { id: 4, link: "aventura-e-viagem", name: "Aventura e Viagem" },
    { id: 5, link: "cuidados-e-relax", name: "Cuidados e Relax" },
    { id: 6, link: "workshops", name: "Workshops" },
    { id: 7, link: "presentes-personalizados", name: "Presentes Personalizados" },
    { id: 8, link: "vouchers-presente", name: "Vouchers Presente" },
    { id: 9, link: "sugestoes-para-ele", name: "Sugestões para Ela/e" },
  ];

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

// 🔥 Buscar eventos da API interna
useEffect(() => {
  const loadEvents = async () => {
    try {
      const res = await fetch("/api/eventbrite/events");
      const data: { events?: EventbriteEvent[] } = await res.json();

      const mapped: Gift[] = (data.events ?? []).map((ev) => ({
        id: ev.id,
        title: ev.name?.text ?? "Evento sem título",
        priceRange: "Consultar",
        experiences: 1,
        imageUrl: ev.logo?.url ?? "/images/cartaouser.svg",
        isFavorite: false,
      }));

      setGifts(mapped);
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
      setGifts([]); // fallback para array vazio
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, []);


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

        {loading ? (
          <p className="text-center text-gray-500">Carregando experiências...</p>
        ) : gifts.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma experiência encontrada.</p>
        ) : (
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
        )}
      </main>
      <Footer />
    </div>
  );
}
