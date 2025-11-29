import Image from 'next/image';
import { EventbriteEvent } from '@/types/eventbrite';
import EventPriceInfo from './EventPriceInfo';

interface Props {
  event: EventbriteEvent;
}

export default function EventHeader({ event }: Props) {
  const imageUrl = event.logo?.url || '/images/cartaouser.svg';
  const location = event.online_event
    ? 'Evento Online'
    : event.venue?.address
      ? [
          event.venue.address.address_1,
          event.venue.address.city,
          event.venue.address.region,
          event.venue.address.postal_code,
        ].filter(Boolean).join(', ')
      : 'Local não informado';

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-10">
      <div className="md:w-1/3 flex-shrink-0">
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
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{event.name.text}</h1>
        <p className="text-gray-700 leading-relaxed">
          {event.description?.text || 'Descrição não disponível.'}
        </p>
        <p className="text-sm text-gray-600">📍 {location}</p>
        <EventPriceInfo event={event} />
      </div>
    </div>
  );
}