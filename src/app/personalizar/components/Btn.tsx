'use client';

import {
  MicrophoneIcon,
  VideoCameraIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';

export default function Bnt() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

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

      recordedChunksRef.current = [];
    });
  };

  const handleRecordAudio = async () => {
    if (isRecordingAudio) {
      stopRecording('audio');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);

      mediaRecorder.addEventListener('stop', () => {
        stream.getTracks().forEach((track) => track.stop());
      });
    } catch (err) {
      console.error('Erro ao acessar o microfone:', err);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const handleRecordVideo = async () => {
    if (isRecordingVideo) {
      stopRecording('video');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
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
      alert(
        'Não foi possível acessar a câmera ou microfone. Verifique as permissões.'
      );
    }
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const triggerAudioUpload = () => {
    audioFileInputRef.current?.click();
  };

  const triggerVideoUpload = () => {
    videoFileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Áudio */}
      <div className="flex flex-col gap-2 p-3 border border-gray-300 rounded-lg">
        <button
          onClick={handleRecordAudio}
          className={`w-full flex items-center justify-center font-medium py-2 px-4 rounded-full transition ${
            isRecordingAudio
              ? 'bg-red-50 text-red-700 border border-red-500'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isRecordingAudio ? (
            <>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Parar Gravação de Áudio
            </>
          ) : (
            <>
              <MicrophoneIcon className="h-5 w-5 mr-2" />
              Gravar Áudio Personalizado
            </>
          )}
        </button>

        <button
          onClick={triggerAudioUpload}
          className="w-full flex items-center justify-center border border-gray-300
            font-medium py-2 px-4 rounded-full transition"
        >
          
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Carregar Áudio do Dispositivo
        </button>
        <input
          type="file"
          ref={audioFileInputRef}
          accept="audio/*"
          onChange={handleUploadAudio}
          className="hidden"
        />
      </div>

      {/* Vídeo */}
      <div className="flex flex-col gap-2 p-3 border border-gray-300 rounded-lg">
        <button
          onClick={handleRecordVideo}
          className={`w-full flex items-center justify-center font-medium py-2 px-4 rounded-full transition ${
            isRecordingVideo
              ? 'bg-red-50 text-red-700 border border-red-500'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isRecordingVideo ? (
            <>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Parar Gravação de Vídeo
            </>
          ) : (
            <>
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Gravar Vídeo Personalizado
            </>
          )}
        </button>

        <button
          onClick={triggerVideoUpload}
          className="w-full flex items-center justify-center border border-gray-300
            font-medium py-2 px-4 rounded-full transition"
        >
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Carregar Vídeo do Dispositivo
        </button>
        <input
          type="file"
          ref={videoFileInputRef}
          accept="video/*"
          onChange={handleUploadVideo}
          className="hidden"
        />
      </div>

      {/* Pré-visualizações */}
      {audioUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Áudio selecionado:</p>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {videoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Vídeo selecionado:</p>
          <video controls src={videoUrl} className="w-full rounded" />
        </div>
      )}
    </div>
  );
}