'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ParceirosCardProps {
  title: string;
  price?: number;      // opcional
  rating?: number;     // opcional
  slug?: string;       // opcional
  image: string;       // obrigatório
  video?: string;      // opcional
}

const ParceirosCard: React.FC<ParceirosCardProps> = ({ title, image, slug}) => {
  return (
    <Link className="block group" href={`/cestas/${slug}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1">
        
        {/* Imagem do produto */}
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
          <Image
            src={image} // URL do VPS
            alt={title}
            width={300}
            height={200}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          {/* Título */}
          <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-red-700 transition-colors">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default ParceirosCard;
