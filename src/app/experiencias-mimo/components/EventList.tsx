'use client';

import { useEffect, useState } from 'react';
import EventCard, { EventbriteEvent } from './EventCard';

interface EventListProps {
  onAdd?: (id: string) => void;
  onGift?: (id: string) => void;
  category?: string; // ← nova prop opcional para filtragem
}

export default function EventList({ onAdd, onGift, category }: EventListProps) {
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Adiciona parâmetro de categoria se fornecido
        const url = category
          ? `/api/eventbrite/events?category=${encodeURIComponent(category)}`
          : '/api/eventbrite/events';

        const res = await fetch(url);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Erro ${res.status}: falha ao carregar eventos`);
        }
        const data = await res.json();
        // ✅ Garante que 'events' seja sempre um array
        const eventsArray = Array.isArray(data.events) ? data.events : [];
        setEvents(eventsArray);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Não foi possível carregar as experiências neste momento.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [category]); // ← refetch quando a categoria mudar

  const handleShare = (url: string, title: string) => {
    if (navigator.share) {
      navigator.share({ title, url }).catch(console.warn);
    } else {
      navigator.clipboard.writeText(url).then(
        () => {
          // ✅ Evite alert() em produção — mas ok para MVP
          // Considere usar toast (ex: Sonner, Toastify) depois
          alert('Link copiado para a área de transferência!');
        },
        () => {
          alert('Falha ao copiar link.');
        }
      );
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando experiências...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500">
      {category 
        ? 'Nenhuma experiência encontrada nesta categoria.' 
        : 'Nenhum evento disponível no momento.'}
    </p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onAdd={onAdd}
          onGift={onGift}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}