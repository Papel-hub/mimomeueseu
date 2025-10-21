'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  VideoCameraIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleBottomCenterIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Import dinâmico do <model-viewer> (só roda no client)
const ModelViewer = dynamic(() => import('./ModelViewerWrapper'), { ssr: false });

export default function Acao() {
  const [show3D, setShow3D] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleView3D = () => setShow3D(true);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Confira esta experiência 3D!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRecommend = () => {
    alert('Indicação enviada com sucesso!');
  };

  const handleInvite = () => {
    const message = encodeURIComponent(
      'Olha essa experiência 3D incrível: ' + window.location.href
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bloco Experiência */}
      <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-lg text-gray-800 mb-3">Experiência</h2>

        <button
          onClick={handleView3D}
          className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-300 transition-all"
        >
          <VideoCameraIcon className="h-5 w-5 text-gray-600" />
          Ver em 3D + VR
        </button>

        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition mt-3"
        >
          <ShareIcon className="h-5 w-5 text-gray-600" />
          {isSharing ? 'Compartilhando...' : 'Compartilhar'}
        </button>
      </div>

      {/* Bloco Indicar */}
      <div className="border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-lg text-gray-800 mb-3">Indicar</h2>

        <button
          onClick={handleRecommend}
          className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-pink-50 hover:border-pink-300 transition mb-3"
        >
          <HeartIcon className="h-5 w-5  text-gray-600" />
          Indicar para um amigo
        </button>

        <button
          onClick={handleInvite}
          className="w-full border py-3 rounded-full flex items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition"
        >
          <ChatBubbleBottomCenterIcon className="h-5 w-5 text-gray-600" />
          Convidar por mensagem
        </button>
      </div>

      {/* Modal 3D */}
      {show3D && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl overflow-hidden w-[90%] h-[80%] max-w-3xl shadow-xl">
            <button
              onClick={() => setShow3D(false)}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-100 z-10"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
            <ModelViewer />
          </div>
        </div>
      )}
    </div>
  );
}
