'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResumoMensagem() {
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasAudio(!!localStorage.getItem('mimo_midia_audio'));
    setHasVideo(!!localStorage.getItem('mimo_midia_video'));
  }, []);

  if (!hasAudio && !hasVideo) return null;

  return (
    <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      {hasAudio && <span>✅ Áudio incluído • </span>}
      {hasVideo && <span>🎥 Vídeo incluído • </span>}
      <button
        onClick={() => router.push('/midia?tipo=' + (hasVideo ? 'video' : 'audio'))}
        className="underline"
      >
        Editar
      </button>
    </div>
  );
}