'use client';

import { useRouter } from "next/navigation";
import { StarIcon, 
    ShareIcon, 
    HeartIcon, 
    ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


// Dados fictícios – substitua por chamada à API ou props do servidor

export default function CarrinhoPage() {
      const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Header fixo */}
        <Header /> 
        {/* Breadcrumb */}
        
        <main className="flex-grow px-4 p-6 space-y-6 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LADO ESQUERDO - Galeria */}
<h1 className="text-3xl font-bold text-gray-900">Carrinho</h1>

        </div>
        <div className="w-full flex flex-col lg:flex-row gap-4 mt-6">
        {/* Itens da Cesta */}
        <div className="flex-1 border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-lg text-gray-800 mb-2">Itens:</h2>
            <ul className="space-y-1">

            </ul>
            <h3 className="font-medium text-green-800 mb-2">Informações adicionais</h3>
            <ul className="text-sm text-gray-700 space-y-1">
            <li>•</li>
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