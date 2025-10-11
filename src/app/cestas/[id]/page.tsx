'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, 
    ShareIcon, 
    HeartIcon, 
    ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


// Dados fictícios – substitua por chamada à API ou props do servidor
const product = {
  id: '1',
  name: 'Cesta Orgânica Premium',
  rating: 4.8,
  reviewCount: 124,
  price: 189.9,
  description: 'Uma seleção cuidadosa de frutas, legumes e verduras orgânicos da estação, colhidos na véspera para garantir frescor e sabor.',
  videoUrl: '/videos/cesta-demo.mp4',
  images: [
    '/images/p1.png',
    '/images/p1.png',
    '/images/p1.png',
  ],
  items: [
    'Maçã Fuji',
    'Banana Prata',
    'Tomate Orgânico',
    'Alface Crespa',
    'Cenoura',
    'Laranja Pera',
  ],
  nutritionalInfo: {
    calories: 'Baixo teor calórico',
    origin: 'Produção local – Serra Gaúcha',
    certification: 'Certificação Orgânica IBD',
  },
};

export default function ProductDetailPage() {
  const router = useRouter();
  const [mainMedia, setMainMedia] = useState<string | null>(product.videoUrl);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setMainMedia(null); // Garante que o vídeo não fique travado
    setSelectedImageIndex(index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fixo */}
        <Header /> 
        {/* Breadcrumb */}
        
        <main className="flex-grow px-4 p-6 space-y-6 pt-24 pb-8 sm:pt-28 sm:pb-12">
           <Link href="/cestas" className="hover:underline mt-4 font-bold text-3xl">←</Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LADO ESQUERDO - Galeria */}
        <div className="flex flex-row gap-4">
            {/* Miniaturas vertical */}
            <div className="flex flex-col gap-3">
            {/* Vídeo */}
            <button
                onClick={() => setMainMedia(product.videoUrl)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                mainMedia ? 'border-green-500' : 'border-transparent'
                }`}
            >
                <div className="bg-black text-white text-xs flex items-center justify-center w-full h-full">
                ▶️
                </div>
            </button>

            {/* Imagens */}
            {product.images.map((img, idx) => (
                <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    !mainMedia && selectedImageIndex === idx
                    ? 'border-green-500'
                    : 'border-transparent'
                }`}
                >
                <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                />
                </button>
            ))}
            </div>

            {/* Mídia Principal */}
            <div className="bg-gray-100 rounded-xl flex items-center justify-center w-full max-w-[500px] max-h-[425px]">
            {mainMedia ? (
                <video
                src={mainMedia}
                controls
                className="w-full h-full object-contain rounded-xl"
                poster={product.images[0]}
                />
            ) : (
                <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                width={400}
                height={400}
                className="object-contain w-full h-full"
                />
            )}
            </div>
        </div>

                    {/* LADO DIREITO - Informações do produto */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        {/* Avaliação */}
                        <div className="flex items-center mt-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                            <StarIcon
                                key={i}
                                className={`h-5 w-5 ${
                                i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            />
                            ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                            {product.rating} ({product.reviewCount} avaliações)
                        </span>
                        </div>

                        {/* Descrição */}
                        <p className="mt-2 text-gray-700">{product.description}</p>

                        {/* Formato da Cestaria */}
                        <div className="mt-4">
                        <h2 className="font-semibold text-lg text-gray-800 mb-2">
                            Escolha o formato da cestaria:
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {['Maleta', 'Bandeja', 'Cesta'].map((format) => (
                            <label
                                key={format}
                                className="flex items-center border rounded-lg px-3 py-2 cursor-pointer hover:border-red-500 transition"
                            >
                                <input
                                type="checkbox"
                                className="mr-2 h-4 w-4 text-red-900 rounded focus:ring-red-500"
                                />
                                <span className="text-gray-700">{format}</span>
                            </label>
                            ))}
                        </div>
                        </div>

                        {/* Preço */}
                        <p className="text-2xl font-bold text-red-900 mt-4">
                        VALOR: R$ {product.price.toFixed(2)}
                        </p>
                                        <div className="mt-6 p-4 bg-red-50 rounded-lg">
                                        <h3 className="font-medium text-red-900">Envio pelos Correios/Transportadoras:</h3>
                                        <ul className="mt-2 text-sm text-gray-700 space-y-1">
                                        <li>• Apenas maletas e produtos não pereciveis</li>
                                        <li>• Outars opções disponiveis via delivery</li>
                                        </ul>
                                    </div>
                    </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-4 mt-6">
        {/* Itens da Cesta */}
        <div className="flex-1 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Itens:</h2>
            <ul className="space-y-1">
            {product.items.map((item, idx) => (
                <li key={idx} className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                {item}
                </li>
            ))}
            </ul>
            <h3 className="font-medium text-green-800 mb-2">Informações adicionais</h3>
            <ul className="text-sm text-gray-700 space-y-1">
            <li>• {product.nutritionalInfo.calories}</li>
            <li>• {product.nutritionalInfo.origin}</li>
            <li>• {product.nutritionalInfo.certification}</li>
            </ul>
            <button className="border mt-2 bg-red-900 text-white w-full border-gray-300 hover:bg-red-900 justify-center py-3 rounded-full flex items-center gap-2">
                <ChatBubbleBottomCenterIcon className="h-5 w-5" />
                    Personalizar cesta
            </button>
        </div>

            {/* Avaliações dos Clientes (opcional) */}
            <div className="flex-1 border border-gray-200 rounded-lg p-4">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">Avaliações (20)</h2>
                        <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className=" pb-6">
                            <div className="flex items-center">
                                <div className="font-medium">Cliente {i}</div>
                                <div className="ml-4 flex">
                                {[...Array(5)].map((_, j) => (
                                    <StarIcon
                                    key={j}
                                    className="h-4 w-4 text-yellow-400"
                                    />
                                ))}
                                </div>
                            </div>
                            <p className="mt-2 text-gray-600">
                                Cesta chegou fresquíssima! Recomendo muito para quem busca qualidade e praticidade.
                            </p>
                            </div>
                        ))}
                        </div>

            </div>
        </div>
        {/* Botões de Ação */}
        <div className="w-full flex flex-col justify-center lg:flex-row gap-4 mt-6">
            <div className="flex-1 border item-center  border-gray-200 rounded-lg p-4">
                <h2 className="font-semibold text-lg text-gray-800 mb-2">Experiência e Compartilhamento</h2>
                <button 
                 onClick={() => router.push("/cestas/personalizar")}
                className="border  w-full border-gray-300 hover:bg-red-800 justify-center py-3 rounded-full flex items-center gap-2">
                    <ChatBubbleBottomCenterIcon className="h-5 w-5" />
                        Ver em 3D + VR
                </button>
                <button className="border mt-2 w-full border-gray-300 hover:bg-gray-50 justify-center py-3 rounded-full flex items-center gap-2">
                    <ShareIcon className="h-5 w-5" />
                        Compartilhar
                </button>
            </div> 

            <div className="flex-1 border border-gray-200 rounded-lg gap-2 p-4">
                <h2 className="font-semibold text-lg text-gray-800 mb-2">Envio e Indicação</h2>
                <button className="border  w-full border-gray-300 hover:bg-gray-50 justify-center py-3 rounded-full flex items-center gap-2">
                    <HeartIcon className="h-5 w-5" />
                         Indicar
                </button>
                <button className="border mt-2 w-full border-gray-300 hover:bg-gray-50 justify-center py-3 rounded-full flex items-center gap-2">
                    <ChatBubbleBottomCenterIcon className="h-5 w-5" />
                        Convidar
               </button>
            </div>
        </div>
        </main>

        {/* Footer */}
        <Footer />
    </div>
  );
}