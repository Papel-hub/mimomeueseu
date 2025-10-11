'use client';
import { useRouter, useParams } from "next/navigation"; 
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeftIcon, PlusCircleIcon, MicrophoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const product = {
  id: '1',
  title: 'Cesta Romântica Premium',
  price: 123.9,
};

const categories = [
  { name: 'Chocolates', options: ['Trufas de Chocolate ao Leite', 'Bombons Recheados', 'Tablete 70% Cacau'] },
  { name: 'Vinhos', options: ['Vinho Tinto Suave', 'Vinho Branco Seco', 'Espumante Rosé'] },
  { name: 'Pelúcias', options: ['Urso de Pelúcia 30cm', 'Coelhinho Fofo', 'Gatinho de Pelúcia'] },
  { name: 'Flores', options: ['Rosas Vermelhas', 'Orquídeas Brancas', 'Buquê de Girassóis'] },
];

export default function PersonalizarPage() { 
  const params = useParams(); 
  const id = params.id as string; 

  const [selectedItems, setSelectedItems] = useState<Record<string, { option: string; quantity: number }>>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(product.price);
  const router = useRouter();

  useEffect(() => {
    let subtotal = product.price;
    Object.values(selectedItems).forEach(item => {
      if (item.option) {
        subtotal += 15.9 * (item.quantity || 1);
      }
    });
    if (audioUrl || videoUrl) subtotal += 19.9;
    setTotal(subtotal);
  }, [selectedItems, audioUrl, videoUrl]);

  const handleOptionChange = (category: string, value: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: { ...prev[category], option: value },
    }));
  };

  const handleQuantityChange = (category: string, value: string) => {
    const qty = parseInt(value) || 0;
    setSelectedItems(prev => ({
      ...prev,
      [category]: { ...prev[category], quantity: qty },
    }));
  };

  const addNewCategory = (category: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: { option: '', quantity: 1 },
    }));
  };

  const handleUploadAudio = () => setAudioUrl('https://example.com/audio.mp3');
  const handleUploadVideo = () => setVideoUrl('https://example.com/video.mp4');

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

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Personalizar Cesta</h1>
        <p className="text-sm text-gray-600 text-center mb-8">Selecione os itens e quantidades desejadas.</p>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
          {categories.map((cat, index) => (
            <div key={index} className="border-b pb-6 last:border-b-0">
              <h2 className="font-semibold text-lg text-gray-800 mb-3">{cat.name}</h2>

              <select
                value={selectedItems[cat.name]?.option || ''}
                onChange={(e) => handleOptionChange(cat.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
              >
                <option value="">Selecione</option>
                {cat.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantidade"
                value={selectedItems[cat.name]?.quantity || ''}
                onChange={(e) => handleQuantityChange(cat.name, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
              />

              <button
                onClick={() => addNewCategory(cat.name)}
                className="text-red-900 flex items-center gap-1 text-sm font-medium"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Adicionar novo
              </button>
            </div>
          ))}

          <div className="border-t pt-6 mt-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">Vídeo ou Áudio Personalizado (opcional)</h2>
            <p className="text-xs text-gray-500 mb-3">Adicional de R$ 19,90 será adicionado.</p>

            <div className="space-y-3">
              <button
                onClick={handleUploadAudio}
                className="w-full flex items-center justify-center font-bold gap-2 p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                <MicrophoneIcon className="h-5 w-5" />
                Gravar Áudio Personalizado
              </button>

              <button
                onClick={handleUploadVideo}
                className="w-full flex items-center font-bold justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                <VideoCameraIcon className="h-5 w-5" />
                Gravar Vídeo Personalizado
              </button>
            </div>
          </div>
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">R$ {product.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Frete</span>
            <span className="font-medium">R$ 16,30</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
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
