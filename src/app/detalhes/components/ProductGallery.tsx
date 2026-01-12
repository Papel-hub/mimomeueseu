'use client';

import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

interface GalleryProps {
  images: string[];
  video?: string;
  mainMedia: string | null;
  setMainMedia: (url: string | null) => void;
  selectedImageIndex: number;
  setSelectedImageIndex: (idx: number) => void;
  title: string;
}

export default function ProductGallery({
  images,
  video,
  mainMedia,
  setMainMedia,
  selectedImageIndex,
  setSelectedImageIndex,
  title
}: GalleryProps) {

  // Função interna para lidar com o clique na imagem
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setMainMedia(null); // Remove o vídeo da tela principal se houver
  };

  return (
    <div className="flex flex-row gap-4">
      {/* Coluna de Miniaturas */}
      <div className="flex flex-col gap-3 items-center">
        {/* Botão do vídeo (se existir) */}
        {video && (
          <button
            onClick={() => setMainMedia(video)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              mainMedia === video
                ? 'border-red-600 ring-2 ring-red-100'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <div className="bg-black text-white text-xs flex items-center justify-center w-full h-full">
              <FaPlay className="text-lg" />
            </div>
          </button>
        )}

        {/* Miniaturas das Imagens */}
        {images.slice(0, 3).map((img, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              !mainMedia && selectedImageIndex === idx
                ? 'border-red-600 ring-2 ring-red-100'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Visualização Principal */}
      <div className="bg-white border border-gray-100 rounded-xl flex items-center justify-center w-full aspect-square overflow-hidden shadow-sm">
        {mainMedia ? (
          <video 
            src={mainMedia} 
            controls 
            className="w-full h-full object-contain bg-black" 
            poster={images[0]} 
          />
        ) : (
          <div className="relative w-full h-full">
             <Image 
              src={images[selectedImageIndex]} 
              alt={title} 
              fill
              className="object-contain animate-fade-in" 
            />
          </div>
        )}
      </div>
    </div>
  );
}