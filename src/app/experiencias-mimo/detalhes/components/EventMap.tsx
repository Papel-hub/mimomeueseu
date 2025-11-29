import { EventbriteEvent } from '@/types/eventbrite';

interface Props {
  event: EventbriteEvent;
}

export default function EventMap({ event }: Props) {
  if (event.online_event) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
        <p className="text-gray-700">
          Este é um evento online. Você receberá o link de acesso por e-mail após a inscrição.
        </p>
      </div>
    );
  }

  if (!event.venue?.address) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
        <p className="text-gray-600">Local do evento não disponível.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="relative h-80 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
        <p className="text-gray-500">
          Mapa de {event.venue.name || 'local do evento'}
        </p>
        {/* Aqui você pode inserir: <iframe src="..." /> do Google Maps no futuro */}
      </div>
    </div>
  );
}