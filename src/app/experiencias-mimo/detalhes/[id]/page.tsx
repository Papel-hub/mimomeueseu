'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Tipos (opcional, mas recomendado)
interface EventbriteEvent {
  id: string;
  name: { text: string };
  description?: { text: string };
  url: string;
  logo?: { url: string } | null;
  start?: { local: string };
  end?: { local: string };
  online_event: boolean;
  venue?: {
    name: string;
    address?: {
      address_1?: string;
      city?: string;
      region?: string;
      postal_code?: string;
      country?: string;
    };
  };
  ticket_classes?: Array<{
    free: boolean;
    cost?: { currency: string; value: number };
  }>;
}

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
      // setEvent(null); (já começa como null)
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

  // Funções auxiliares
  const getPriceRange = (): string => {
    if (!event.ticket_classes || event.ticket_classes.length === 0) {
      return 'Gratuito';
    }

    const paid = event.ticket_classes.filter(t => !t.free && t.cost);
    if (paid.length === 0) return 'Gratuito';

    const prices = paid.map(t => t.cost!.value / 100);
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
  const description = event.description?.text || 'Descrição não disponível.';
  const location = event.online_event
    ? 'Evento Online'
    : event.venue?.address
      ? [
          event.venue.address.address_1,
          event.venue.address.city,
          event.venue.address.region,
          event.venue.address.postal_code,
        ]
          .filter(Boolean)
          .join(', ')
      : 'Local não informado';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
            <div className="md:w-1/3">
              <Image
                src={imageUrl}
                alt={event.name.text}
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover w-full h-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/cartaouser.svg';
                }}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name.text}</h1>
              <p className="text-gray-700 leading-relaxed">{description}</p>
              <p className="mt-3 text-sm text-gray-600">📍 {location}</p>
            </div>
                          
              <div className="flex flex-row gap-2 mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Preços: <strong>{getPriceRange()}</strong>
                </p>
                <button
                  className="w-full flex items-center justify-center border border-red-900 text-white
                  font-medium py-2 px-4 rounded-full transition hover:bg-red-800 bg-red-900"
                  aria-label="Comprar agora"
                >
                Comprar agora
                </button>
              </div>
          </div>

          {/* Abas */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['descricao', 'mapa', 'como-funciona'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md capitalize ${
                  viewMode === mode
                    ? 'bg-red-900 text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
              >
                {mode === 'descricao' ? 'Descrição' : mode === 'mapa' ? 'Ver mapa' : 'Como funciona'}
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          {viewMode === 'descricao' && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Detalhes do Evento</h2>
              <p className="whitespace-pre-line">{description}</p>
            </div>
          )}

          {viewMode === 'mapa' && !event.online_event && event.venue?.address && (
            <div className="mt-6">
              <div className="relative h-80 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                <p className="text-gray-500">Mapa de {event.venue.name || 'local do evento'}</p>
                {/* Aqui você pode integrar Google Maps Embed no futuro */}
              </div>
            </div>
          )}

          {viewMode === 'mapa' && event.online_event && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700">Este é um evento online. Você receberá o link de acesso por e-mail após a inscrição.</p>
            </div>
          )}

          {viewMode === 'como-funciona' && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Como Funciona</h2>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Escolha a data e compre seu ingresso.</li>
                <li>Receba confirmação por e-mail com detalhes do evento.</li>
                <li>Compareça no local (ou online) na data agendada.</li>
                <li>Viva a experiência!</li>
              </ol>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}