'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventHeader from '../components/EventHeader';
import EventTabs from '../components/EventTabs';
import EventDescription from '../components/EventDescription';
import EventMap from '../components//EventMap';
import EventHowItWorks from '../components/EventHowItWorks';
import { EventbriteEvent } from '@/types/eventbrite'; 

export default function ExperienceDetailPage() {
  const params = useParams();
  const { id } = params;
  const [event, setEvent] = useState<EventbriteEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'descricao' | 'mapa' | 'como-funciona'>('descricao');

  useEffect(() => {
    const fetchEvent = async () => {
      const eventId = Array.isArray(id) ? id[0] : id;
      if (!eventId) return setLoading(false);

      setLoading(true);
      try {
        const res = await fetch(`/api/eventbrite/events/${eventId}`);
        if (!res.ok) throw new Error('Evento não encontrado');
        const { event } = await res.json();
        setEvent(event);
      } catch (err) {
        console.error('Erro ao carregar detalhes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-600">Carregando experiência...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-600">Experiência não encontrada.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 sm:px-8 md:px-16 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <EventHeader event={event} />
          <EventTabs viewMode={viewMode} setViewMode={setViewMode} />
          
          {viewMode === 'descricao' && <EventDescription description={event.description?.text || 'Descrição não disponível.'} />}
          
          {viewMode === 'mapa' && <EventMap event={event} />}
          
          {viewMode === 'como-funciona' && <EventHowItWorks />}
        </div>
      </main>
      <Footer />
    </div>
  );
}