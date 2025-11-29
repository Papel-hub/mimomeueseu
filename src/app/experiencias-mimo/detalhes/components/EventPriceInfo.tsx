import { EventbriteEvent } from '@/types/eventbrite';

interface Props {
  event: EventbriteEvent;
}

export default function EventPriceInfo({ event }: Props) {
  const getPriceRange = (): string => {
    if (!event.ticket_classes?.length) return 'Gratuito';
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

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <p className="text-sm text-gray-600">
        Preços: <strong>{getPriceRange()}</strong>
      </p>
      <button
        className="w-full sm:w-auto flex items-center justify-center border border-red-900 text-white font-medium py-2 px-4 rounded-full transition hover:bg-red-800 bg-red-900"
        aria-label="Comprar ingresso"
      >
        Comprar Ingresso
      </button>
    </div>
  );
}