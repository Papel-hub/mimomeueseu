'use client';

import { useState } from 'react';
import Image from 'next/image';
import {  Eye } from "lucide-react";

import { FaGift } from 'react-icons/fa';

import {
  ShareIcon,
} from '@heroicons/react/24/outline';
interface TicketClass {
  free: boolean;
  cost?: { currency: string; value: number };
}

interface EventbriteLogo {
  url: string;
}

export interface EventbriteEvent {
  id: string;
  name: { text: string };
  url: string;
  logo?: EventbriteLogo | null;
  ticket_classes?: TicketClass[];
  online_event: boolean;
}

interface EventCardProps {
  event: EventbriteEvent;
  onAdd?: (id: string) => void;
  onGift?: (id: string) => void;
  onViewDetails?: (url: string) => void;
  onShare?: (url: string, title: string) => void;
}

export default function EventCard({
  event,
  onAdd,
  onGift,
  onViewDetails,
  onShare,
}: EventCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleViewDetails = () => onViewDetails?.(event.url);
  const handleAdd = () => onAdd?.(event.id);
  const handleGift = () => onGift?.(event.id);
  const handleShare = () => onShare?.(event.url, event.name.text);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">

      <div className="relative w-full bg-gray-100">
        <Image
          src={imageUrl}
          alt={event.name.text}   
          width={300}
          height={400}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/cartaouser.svg';
          }}
        />
        <button
          onClick={handleAdd}
          className="absolute top-2 right-2 p-1.5 bg-white/50 text-white w-10 h-10 rounded-full hover:bg-red-900 
          transition-all"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
            +
        </button>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{event.name.text}</h3>
        <p className="text-sm text-gray-600 mb-1">{getPriceRange()}</p>
        <p className="text-xs text-gray-500 mb-3">
          {event.online_event ? '📍 Online' : '📍 Presencial'}
        </p>
      </div>

      <div className="px-2 pb-3">
    <div className="mt-6 space-y-4">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center border border-red-900 text-white
            font-medium py-2 px-4 rounded-full transition hover:bg-red-800 bg-red-900"
            aria-label="Visualizar detalhes"
          >
            <Eye className="h-5 w-5 mr-2" aria-hidden="true" />
            Visualizar
          </button>
         <button 
            onClick={handleGift}
            aria-label="Presentear"
            className="w-full flex items-center justify-center border border-red-900 text-red-900 font-medium py-2 px-4 rounded-full transition hover:bg-red-50"
            >                   
            <FaGift className="h-5 w-5 mr-2" aria-hidden="true" />
            Presentear
          </button>


          <button
            onClick={handleShare}
          aria-label="Compartilhar"
          className="w-full border font-medium py-2 px-4 rounded-full flex items-center justify-center  hover:bg-gray-100 hover:border-gray-300 transition"
          >
          <ShareIcon className="h-5 w-5 mr-2 text-gray-600" aria-hidden="true"  />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}