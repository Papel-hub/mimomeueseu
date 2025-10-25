// app/midia/MidiaClient.tsx
'use client';

import {
  MicrophoneIcon,
  VideoCameraIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { use } from 'react'; // ← Importante!


export default function MidiaClient({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const resolvedParams = use(searchParams); // ← Resolve a Promise
  const tipo = resolvedParams.tipo;

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tipo !== 'audio' && tipo !== 'video') {
      setError('Tipo de mídia inválido.');
    }
  }, [tipo]);

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const constraints =
        tipo === 'audio'
          ? { audio: true }
          : { video: true, audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      recordedChunksRef.current = [];
      const mimeType =
        tipo === 'audio'
          ? MediaRecorder.isTypeSupported('audio/webm')
            ? 'audio/webm'
            : 'audio/ogg'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : MediaRecorder.isTypeSupported('video/webm')
          ? 'video/webm'
          : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: tipo === 'audio' ? 'audio/webm' : 'video/webm',
        });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        localStorage.setItem(`mimo_midia_${tipo}`, url);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(`Erro ao acessar ${tipo}:`, err);
      alert(
        `Não foi possível acessar o ${
          tipo === 'audio' ? 'microfone' : 'câmera/microfone'
        }. Verifique as permissões.`
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      localStorage.setItem(`mimo_midia_${tipo}`, url);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    router.push('/entrega');
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4 text-red-600">
          {error}
        </main>
        <Footer />
      </div>
    );
  }

  if (!tipo) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {tipo === 'audio' ? 'Mensagem de Áudio' : 'Mensagem em Vídeo'}
          </h1>
          <p className="text-gray-600 text-center">
            {tipo === 'audio'
              ? 'Grave ou envie uma mensagem de áudio personalizada'
              : 'Grave ou envie um vídeo com sua mensagem personalizada'}
          </p>

          <div className="space-y-4">
            <button
              onClick={startRecording}
              className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-full transition ${
                isRecording
                  ? 'bg-red-50 text-red-700 border border-red-500'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isRecording ? (
                <>
                  <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2" />
                  Parar {tipo === 'audio' ? 'Gravação de Áudio' : 'Gravação de Vídeo'}
                </>
              ) : (
                <>
                  {tipo === 'audio' ? (
                    <MicrophoneIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <VideoCameraIcon className="h-5 w-5 mr-2" />
                  )}
                  {tipo === 'audio' ? 'Gravar Áudio' : 'Gravar Vídeo'}
                </>
              )}
            </button>

            <button
              onClick={triggerFileUpload}
              className="w-full flex items-center justify-center border border-gray-300 font-medium py-3 px-4 rounded-full transition hover:bg-gray-50"
            >
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Carregar do Dispositivo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept={tipo === 'audio' ? 'audio/*' : 'video/*'}
              onChange={handleFileUpload}
              className="hidden"
            />

            {mediaUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {tipo === 'audio' ? 'Áudio selecionado:' : 'Vídeo selecionado:'}
                </p>
                {tipo === 'audio' ? (
                  <audio controls src={mediaUrl} className="w-full" />
                ) : (
                  <video controls src={mediaUrl} className="w-full rounded" />
                )}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-red-900 text-white font-medium rounded-full hover:bg-red-800 transition"
            >
              Continuar para entrega
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}