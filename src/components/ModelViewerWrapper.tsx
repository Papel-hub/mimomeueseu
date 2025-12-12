// src/components/ModelViewerWrapper.tsx
'use client';

import '@google/model-viewer';
import React, { useEffect, useRef } from 'react';

export default function ModelViewerWrapper({ onLoaded }: { onLoaded: () => void }) {
  const viewerRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cria o elemento de áudio uma vez
    if (!audioRef.current) {
      const audio = new Audio('/audios/mimo.mp3');
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const viewer = viewerRef.current;
    const audio = audioRef.current;

    if (!viewer) return;

    const handleLoad = async () => {
      try {
        // Tenta reproduzir o áudio (pode falhar se não houver interação do usuário)
        await audio.play();
      } catch (err) {
        console.warn('Falha ao reproduzir áudio automaticamente:', err);
        // Em alguns navegadores, você precisará de interação do usuário primeiro
      }

      // Opcional: aguardar a duração do áudio antes de notificar "loaded"
      // Mas cuidado: o áudio pode ter duração diferente da animação
      // Vamos notificar imediatamente após load + play attempt
      onLoaded();
    };

    viewer.addEventListener('load', handleLoad);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onLoaded]);

  return (
    <model-viewer
      ref={viewerRef}
      src="/models/mimo.glb"
      alt="Mascote 3D"
      ar
      ar-modes="webxr scene-viewer quick-look"
      exposure="0.8"
      shadow-intensity="1"
      style={{ width: '100%', height: '100vh', background: '#fff' }}
    />
  );
}