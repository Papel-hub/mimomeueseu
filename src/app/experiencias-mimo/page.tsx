'use client';

import { useEffect, useState } from 'react';
import GiftVoucherBanner from './components/GiftVoucherBanner';
import CategoryScrollMenu from './components/CategoryScrollMenu';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Tipos baseados na resposta expandida do Eventbrite
interface TicketClass {
  free: boolean;
  cost?: {
    display: string;
    currency: string;
    value: number; // em centavos
  };
}

interface EventbriteLogo {
  url: string;
}

interface EventbriteEvent {
  id: string;
  name: { text: string };
  url: string;
  logo?: EventbriteLogo | null;
  ticket_classes?: TicketClass[];
  online_event: boolean;
}

// 🎁 Componente EventCard especializado para eventos do Eventbrite
const EventCard = ({ event }: { event: EventbriteEvent }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const getPriceRange = (): string => {
    if (!event.ticket_classes || event.ticket_classes.length === 0) {
      return 'Gratuito';
    }

    const paid = event.ticket_classes.filter(t => !t.free && t.cost);
    if (paid.length === 0) return 'Gratuito';

    const prices = paid.map(t => t.cost!.value / 100); // converte centavos → reais
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const currency = paid[0].cost!.currency;

    const format = (v: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency === 'BRL' ? 'BRL' : 'USD',
      }).format(v);

    return min === max ? format(min) : `${format(min)} – ${format(max)}`;
  };

  const imageUrl = event.logo?.url || '/images/cartaouser.svg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Imagem do evento */}
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={imageUrl}
          alt={event.name.text}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/cartaouser.svg';
          }}
        />
        {/* Ícone de favorito */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-all"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.828a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{event.name.text}</h3>
        <p className="text-sm text-gray-600 mb-1">{getPriceRange()}</p>
        <p className="text-xs text-gray-500 mb-3">
          {event.online_event ? '📍 Online' : '📍 Presencial'}
        </p>
      </div>

      {/* Botão de ação */}
      <div className="px-4 pb-4">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-900 hover:bg-red-800 text-white py-2 px-3 rounded-full text-center text-sm font-medium transition"
        >
          Ver no Eventbrite
        </a>
      </div>
    </div>
  );
};

// 🖥️ Página principal
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

  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await fetch('/api/eventbrite/events');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Falha ao carregar eventos');
        }
        const { events: fetchedEvents } = await res.json();
        setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Não foi possível carregar os eventos.');
        setEvents([]);
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
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum evento encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}