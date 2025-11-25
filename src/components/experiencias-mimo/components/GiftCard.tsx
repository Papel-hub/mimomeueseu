// app/components/GiftCard.tsx
'use client';

import Image from 'next/image';

interface GiftCardProps {
  title: string;
  priceRange: string;
  experiences: number;
  imageUrl: string;
  isFavorite?: boolean;
}

const GiftCard = ({ title, priceRange, experiences, imageUrl, isFavorite = false }: GiftCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      {/* Imagem */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Ícone de favorito */}
        <button
          className="absolute top-2 right-2 p-1 bg-white/70 rounded-full hover:bg-white transition"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.828a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-1">{priceRange}</p>
          <p className="text-xs text-gray-500">Experiências: {experiences}</p>
        </div>
      </div>

      {/* Botão de ação */}
      <div className="px-4 pb-4">
        <button className="w-full bg-red-900 hover:bg-red-800 text-white py-2 px-2 rounded-full flex items-center justify-center gap-1 transition text-sm font-medium">
          <span>Escolher</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GiftCard;