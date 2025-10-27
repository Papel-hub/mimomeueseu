'use client';
import React, { useState, useEffect } from 'react';
import { FormatoTipo } from './FormatoSelector';

interface Props {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
  selectedFormat: FormatoTipo;
}

export default function AudioUpload({ audioFile, setAudioFile, selectedFormat }: Props) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Limpa o áudio se o formato não for digital
    if (!selectedFormat.includes('digital')) {
      setAudioFile(null);
      if (audioFile) {
        setError('O upload de música só é permitido para cartões digitais.');
      }
    } else {
      setError(null);
    }
  }, [selectedFormat]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    // Verifica se o formato do cartão permite música
    if (!selectedFormat.includes('digital')) {
      setError('O upload de música só é permitido para cartões digitais.');
      setAudioFile(null);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/mp3', 'audio/wav', 'audio/aiff', 'audio/flac', 'audio/aac'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Use MP3, WAV, AIFF, FLAC ou AAC.');
      setAudioFile(null);
      return;
    }

    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      if (audio.duration > 90) {
        setError('A música deve ter no máximo 90 segundos.');
        setAudioFile(null);
      } else {
        setAudioFile(file);
      }
    };
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar música (opcional)</label>
      <input
        type="file"
        accept=".mp3,.wav,.aiff,.flac,.aac"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {audioFile && <p className="text-green-600 text-sm mt-1">Arquivo selecionado: {audioFile.name}</p>}
    </div>
  );
}
