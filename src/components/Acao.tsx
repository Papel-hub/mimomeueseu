      
      'use client';
      
      import {
        VideoCameraIcon,
        ShareIcon,
        HeartIcon,
        ChatBubbleBottomCenterIcon,
      } from '@heroicons/react/24/outline';

      export default function Acao() {

  return (     
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Experiência</h2>
            <button className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-red-50 transition mb-3">
              <VideoCameraIcon className="h-5 w-5" />
              Ver em 3D + VR
            </button>
            <button className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <ShareIcon className="h-5 w-5" />
              Compartilhar
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Indicar</h2>
            <button className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition mb-3">
              <HeartIcon className="h-5 w-5" />
              Indicar para um amigo
            </button>
            <button className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition">
              <ChatBubbleBottomCenterIcon className="h-5 w-5" />
              Convidar por mensagem
            </button>
          </div>
        </div>

          );
        }