'use client';

import {
  MicrophoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';

export default function Bnt() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Função para parar gravação e salvar
  const stopRecording = (type: 'audio' | 'video') => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    mediaRecorderRef.current?.addEventListener('stop', () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: type === 'audio' ? 'audio/webm' : 'video/webm',
      });
      const url = URL.createObjectURL(blob);

      if (type === 'audio') {
        setAudioUrl(url);
        setIsRecordingAudio(false);
      } else {
        setVideoUrl(url);
        setIsRecordingVideo(false);
      }

      // Limpa os chunks para a próxima gravação
      recordedChunksRef.current = [];
    });
  };

  // Gravar áudio
  const handleRecordAudio = async () => {
    if (isRecordingAudio) {
      stopRecording('audio');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);

      // Libera o stream quando parar
      mediaRecorder.addEventListener('stop', () => {
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  // Gravar vídeo com áudio
  const handleRecordVideo = async () => {
    if (isRecordingVideo) {
      stopRecording('video');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
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

      mediaRecorder.start();
      setIsRecordingVideo(true);

      mediaRecorder.addEventListener('stop', () => {
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (err) {
      console.error('Erro ao acessar câmera/microfone:', err);
      alert('Não foi possível acessar a câmera ou microfone. Verifique as permissões.');
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleRecordAudio}
        className={`w-full flex items-center justify-center font-bold gap-2 p-3 border rounded-full transition ${
          isRecordingAudio
            ? 'border-red-500 bg-red-50 text-red-700'
            : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        {isRecordingAudio ? (
          <>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            Parar Gravação de Áudio
          </>
        ) : (
          <>
            <MicrophoneIcon className="h-5 w-5" />
            Gravar Áudio Personalizado
          </>
        )}
      </button>

      <button
        onClick={handleRecordVideo}
        className={`w-full flex items-center justify-center font-bold gap-2 p-3 border rounded-full transition ${
          isRecordingVideo
            ? 'border-red-500 bg-red-50 text-red-700'
            : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        {isRecordingVideo ? (
          <>
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            Parar Gravação de Vídeo
          </>
        ) : (
          <>
            <VideoCameraIcon className="h-5 w-5" />
            Gravar Vídeo Personalizado
          </>
        )}
      </button>

      {/* Pré-visualizações (opcional) */}
      {audioUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Áudio gravado:</p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Vídeo gravado:</p>
          <video controls src={videoUrl} className="w-full rounded" />
        </div>
      )}
    </div>
  );
}