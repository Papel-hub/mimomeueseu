'use client';
import { useRouter, useParams } from "next/navigation"; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeftIcon, PlusCircleIcon, MicrophoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';



export default function PersonalizarPage() { 
  const params = useParams(); 
  const id = params.id as string; 
  const router = useRouter();

 
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href={`/cestas/${id}`} className="text-red-900 hover:underline flex items-center">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar para detalhes
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Seja um Influenciador(a)!</h1>
        <p className="text-sm text-gray-600 text-center mb-8">Selecione os itens e quantidades desejadas.</p>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
        
            <div className="border-b pb-6 last:border-b-0">
              <h2 className="font-semibold text-lg text-gray-800 mb-3"></h2>


              <input
                type="number"
                min="1"
                placeholder="Quantidade"
              
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
              />

              <button
            
                className="text-red-900 flex items-center gap-1 text-sm font-medium"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Adicionar novo
              </button>
            </div>
      

          <div className="border-t pt-6 mt-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Vídeo ou Áudio Personalizado (opcional)</h2>
            <p className="text-xs text-gray-500 mb-3">Adicional de R$ 19,90 será adicionado.</p>

            <div className="space-y-3">
              <button
              
                className="w-full flex items-center justify-center font-bold gap-2 p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                <MicrophoneIcon className="h-5 w-5" />
                Gravar Áudio Personalizado
              </button>

              <button
                
                className="w-full flex items-center font-bold justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                <VideoCameraIcon className="h-5 w-5" />
                Gravar Vídeo Personalizado
              </button>
            </div>
          </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/mensagem/${id}`)}
            className="w-full flex items-center bg-red-900 font-bold text-white justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-red-800 transition"
          >
            Continuar
          </button>
          <Link
            href={`/cestas/${id}`}
            className="w-full flex items-center justify-center gap-2 font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-100 transition"
          >
            Cancelar
          </Link>
        </div>
        </div>  
      </main>

      <Footer />
    </div>
  );
}
