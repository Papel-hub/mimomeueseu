'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price?: number;      // opcional
  rating?: number;     // opcional
  slug?: string;       // opcional
  image: string;       // obrigatório
  video?: string;      // opcional
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  title, 
  price, 
  rating, 
  image, 
  slug, 
  video 
}) => {
  // Conteúdo visual do card (sem o link externo)
  const cardContent = (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1">
      {/* Imagem do produto */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          width={300}
          height={200}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Ícone de vídeo (se houver) */}
        {video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-12 h-12 bg-red-700/80 text-white rounded-full flex items-center justify-center text-lg font-bold">
              ▶
            </span>
          </div>
        )}
      </div>

      {/* Detalhes do produto */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-red-700 transition-colors">
          {title}
        </h3>

        {/* Preço (só mostra se existir) */}
        {price !== undefined && (
          <p className="text-xl font-bold text-black mt-2">
            R$ {price.toFixed(2)}
          </p>
        )}

        {/* Avaliação em estrelas (só mostra se existir) */}
        {rating !== undefined && (
          <div className="flex items-center mt-1 space-x-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        {/* Botão */}
        <button className="w-full mt-4 bg-red-800 hover:bg-red-700 text-white font-medium py-2 rounded-full transition-colors">
          Ver mais
        </button>
      </div>
    </div>
  );

  // Se tiver slug, envolve com Link; senão, usa uma div (sem navegação)
  if (slug) {
    return (
      <Link className="block group" href={`/cestas/${slug}`}>
        {cardContent}
      </Link>
    );
  }

  return <div className="block group cursor-default">{cardContent}</div>;
};

export default ProductCard;