'use client';

import Image from 'next/image';
import { Eye, Plus } from 'lucide-react'; // ✅ Plus importado
import { FaGift } from 'react-icons/fa';
import { ShareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

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
  onShare?: (url: string, title: string) => void;
}

export default function EventCard({
  event,
  onAdd,
  onGift,
  onShare,
}: EventCardProps) {
  // ❌ Removido: const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  const getPriceRange = (): string => {
    if (!event.ticket_classes?.length) return 'Gratuito';
    const paid = event.ticket_classes.filter(t => !t.free && t.cost);
    if (paid.length === 0) return 'Gratuito';

    const prices = paid.map(t => t.cost!.value / 100);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const currency = paid[0].cost!.currency;

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD',
    }).format(min === max ? min : min) +
      (min !== max ? ` – ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(max)}` : '');
  };

  const imageUrl = event.logo?.url || '/images/cartaouser.svg';
  const locationLabel = event.online_event ? '📍 Online' : '📍 Presencial';

  const handleViewDetails = () => router.push(`/experiencias-mimo/detalhes/${event.id}`);
  const handleAdd = () => onAdd?.(event.id); // ✅ Sem toggle de estado
  const handleGift = () => onGift?.(event.id);
  const handleShare = () => onShare?.(event.url, event.name.text);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full transition-shadow hover:shadow-md">
      <div className="relative w-full bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.name.text}
          width={300}
          height={400}
          className="object-cover transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 300px"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/cartaouser.svg';
          }}
        />
        {/* ✅ Botão "Adicionar à Caixa Mimo" */}
        <button
          onClick={handleAdd}
          aria-label="Adicionar à Caixa Mimo"
          className="absolute top-3 right-3 p-2 bg-white/50 rounded-full shadow-sm hover:bg-red-50 transition-colors"
        >
          <Plus className="h-5 w-5 text-gray-600" aria-hidden="true" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-800 text-base mb-1 line-clamp-2">{event.name.text}</h3>
        <p className="text-sm text-gray-600 mb-1">{getPriceRange()}</p>
        <p className="text-xs text-gray-500 mb-3">{locationLabel}</p>

        <div className="mt-auto space-y-3">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-medium py-2.5 px-4 rounded-full hover:bg-red-800 transition focus:outline-none "
            aria-label="Visualizar detalhes"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Visualizar detalhes
          </button>

          <button
            onClick={handleGift}
            className="w-full flex items-center justify-center gap-2 border border-red-900 text-red-900 font-medium py-2.5 px-4 rounded-full hover:bg-red-50 transition "
            aria-label="Presentear"
          >
            <FaGift className="h-4 w-4" aria-hidden="true" />
            Presentear
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-full hover:bg-gray-50 transition "
            aria-label="Compartilhar"
          >
            <ShareIcon className="h-4 w-4" aria-hidden="true" />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}