'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Tipos baseados na resposta real do Eventbrite (com expand=ticket_classes,logo)
interface TicketClass {
  id: string;
  name: string;
  free: boolean;
  cost?: { display: string; currency: string; value: number };
}

interface EventbriteLogo {
  url: string;
}

interface EventbriteEvent {
  id: string;
  name: { text: string };
  url: string;
  logo?: EventbriteLogo;
  ticket_classes?: TicketClass[];
  start: { local: string };
  online_event: boolean;
}

// Mapeia evento do Eventbrite para props do GiftCard
const EventCard = ({ event }: { event: EventbriteEvent }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Extrai faixa de preço
  const getPriceRange = (): string => {
    if (!event.ticket_classes || event.ticket_classes.length === 0) {
      return 'Gratuito';
    }

    const paidTickets = event.ticket_classes.filter(t => !t.free && t.cost);
    if (paidTickets.length === 0) return 'Gratuito';

    const prices = paidTickets.map(t => parseFloat(t.cost!.value.toString()) / 100); // valor vem em centavos
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const format = (v: number) => v.toLocaleString('pt-BR', {
      style: 'currency',
      currency: paidTickets[0].cost!.currency
    });

    return min === max ? format(min) : `${format(min)} – ${format(max)}`;
  };

  const imageUrl = event.logo?.url || '/placeholder-event.jpg';
  const title = event.name.text;
  const priceRange = getPriceRange();
  const experiences = 1; // ou calcule com base em sessões, se aplicável

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Imagem */}
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem imagem
          </div>
        )}

        {/* Ícone de favorito */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-1 bg-white/70 rounded-full hover:bg-white transition"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
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
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-1">{priceRange}</p>
          <p className="text-xs text-gray-500">
            {event.online_event ? 'Online' : 'Presencial'}
          </p>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="px-4 pb-4">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-red-900 hover:bg-red-800 text-white py-2 px-2 rounded-full text-center text-sm font-medium transition"
        >
          Ver no Eventbrite
        </a>
      </div>
    </div>
  );
};

// Componente principal que carrega e lista os eventos
export default function EventosGiftList() {
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/eventbrite/events');
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Falha ao carregar eventos');
        }
        const { events: fetchedEvents } = await res.json();
        setEvents(fetchedEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-600">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
        Próximos Eventos
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}