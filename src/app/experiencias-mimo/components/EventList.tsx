'use client';

import { useEffect, useState } from 'react';
import EventCard, { EventbriteEvent } from './EventCard';

interface EventListProps {
  onAdd?: (id: string) => void;
  onGift?: (id: string) => void;
}

export default function EventList({ onAdd, onGift }: EventListProps) {
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

  const handleShare = (url: string, title: string) => {
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copiado!');
      });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando experiências...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500">Nenhum evento encontrado.</p>;
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