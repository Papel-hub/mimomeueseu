'use client';

import { useRouter } from 'next/navigation';
import { FaShoppingBasket, FaGift } from 'react-icons/fa';

type CestaActionsProps = {
  cestaId: string;
  selectedFormat: 'cesta' | 'maleta' | 'bandeja' | 'caixa';
  onCheckout: () => void; // 👈 ADICIONE ESTA LINHA
}
export default function CestaActions({ cestaId, selectedFormat }: CestaActionsProps) {
  const router = useRouter();

  const handleEscolherCesta = () => {
    if (selectedFormat === 'caixa') {
      // Redireciona para itens-surpresa
      router.push(`/itens-surpresa/${cestaId}`);
    } else {
      // Fluxo normal: mensagem
      router.push(`/mensagem/${cestaId}`);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={handleEscolherCesta}
        className="w-full flex items-center justify-center border border-red-900 bg-red-900 text-white font-medium py-3 px-4 rounded-full transition hover:bg-red-800"
      >
        <FaShoppingBasket className="h-5 w-5 mr-2" aria-hidden="true" />
        Escolher esta cesta
      </button>

      <button className="w-full flex items-center justify-center border border-red-900 text-red-900 font-medium py-3 px-4 rounded-full transition hover:bg-red-50">
        <FaGift className="h-5 w-5 mr-2" aria-hidden="true" />
        Presentear
      </button>
    </div>
  );
}