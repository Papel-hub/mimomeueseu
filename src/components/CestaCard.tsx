'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';

export interface CestasCardProps {
  id: string;
  title: string;
  price?: number;
  rating?: number;
  image: string;
  bestseller?: boolean;
  showPrice?: boolean;
  showViewDetails?: boolean;
}

const CestasCard = ({
  id,
  title,
  price,
  image,
  bestseller,
  showPrice = true,
  showViewDetails = false,
}: CestasCardProps) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative flex flex-col h-full">
      <Link href={`/detalhes/${id}`} className="block flex-grow">
        {/* Badge "Mais Vendido" */}
        {bestseller && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-tr-xl rounded-bl-2xl z-10 shadow-md">
            MAIS VENDIDO
          </div>
        )}

        {/* Container da Imagem */}
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          <Image
            src={image || '/images/placeholder.png'}
            alt={title || 'Cesta de Presente'}
            fill // Usar fill é mais flexível para grids responsivos
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Informações */}
        <div className="p-4">
          <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
          
          {showPrice && price !== undefined && (
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-sm font-medium text-gray-600">R$</span>
              <span className="text-xl font-bold text-black">
                {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Botão "Ver detalhes" - Alinhado ao fundo */}
      {showViewDetails && (
        <div className="px-4 pb-4">
          <Link
            href={`/detalhes/${id}`}
            className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-medium py-2.5 px-4 rounded-full hover:bg-red-800 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
            aria-label={`Visualizar detalhes de ${title}`}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm">Visualizar detalhes</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CestasCard;