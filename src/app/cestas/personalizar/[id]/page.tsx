'use client';

import {  useParams } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  MicrophoneIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Cesta, CustomizationOption } from '@/types/cesta';
import { useCart } from '@/contexts/CartContext';

export default function PersonalizarPage() {
  const params = useParams();
  const id = params.id as string;
  const [cesta, setCesta] = useState<Cesta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<
    Record<string, { option: string; quantity: number }>
  >({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // 🔹 Carregar cesta do Firebase
  useEffect(() => {
  const fetchCesta = async () => {
    try {
      const docRef = doc(db, 'cestas', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('Cesta não encontrada.');
        return;
      }

      const data = docSnap.data();

      // 🔹 Validação de customizationOptions (pode ser undefined)
      const customizationOptions: CustomizationOption[] = Array.isArray(data.customizationOptions)
  ? data.customizationOptions.filter(
      (opt): opt is CustomizationOption =>
        typeof opt === 'object' &&
        opt !== null &&
        typeof opt.category === 'string' &&
        Array.isArray(opt.options) &&
        opt.options.every((o: unknown) => typeof o === 'string') && // ✅ corrigido aqui
        typeof opt.pricePerItem === 'number'
    )
  : [];

      // 🔹 Validação dos demais campos obrigatórios
      const cestaData: Cesta = {
        id: docSnap.id,
        title: typeof data.title === 'string' ? data.title : 'Sem título',
        price: typeof data.price === 'number' ? data.price : 0,
        rating: typeof data.rating === 'number' ? data.rating : 0,
        reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
        description: typeof data.description === 'string' ? data.description : '',
        image: Array.isArray(data.image) && data.image.every((img: unknown) => typeof img === 'string')
          ? data.image
          : ['/placeholder.jpg'], // fallback seguro
        items: Array.isArray(data.items) && data.items.every((item: unknown) => typeof item === 'string')
          ? data.items
          : [],
        nutritionalInfo: {
          calories: typeof data.nutritionalInfo?.calories === 'string' ? data.nutritionalInfo.calories : 'N/A',
          origin: typeof data.nutritionalInfo?.origin === 'string' ? data.nutritionalInfo.origin : 'N/A',
          certification: typeof data.nutritionalInfo?.certification === 'string'
            ? data.nutritionalInfo.certification
            : 'N/A',
        },
        formatOptions: data.formatOptions && typeof data.formatOptions === 'object'
          ? {
              cesta: typeof data.formatOptions.cesta === 'number' ? data.formatOptions.cesta : undefined,
              maleta: typeof data.formatOptions.maleta === 'number' ? data.formatOptions.maleta : undefined,
              bandeja: typeof data.formatOptions.bandeja === 'number' ? data.formatOptions.bandeja : undefined,
            }
          : undefined,
        customizationOptions, // já validado acima
        mediaPersonalizationFee:
          typeof data.mediaPersonalizationFee === 'number'
            ? data.mediaPersonalizationFee
            : 19.9,
        video: typeof data.video === 'string' ? data.video : undefined,
      };

      setCesta(cestaData);
    } catch (err) {
      console.error('Erro ao carregar cesta:', err);
      setError('Erro ao carregar os dados da cesta.');
    } finally {
      setLoading(false);
    }
  };

  fetchCesta();
}, [id]);

  // 🔹 Calcular total dinamicamente
  const total = useMemo(() => {
    if (!cesta) return 0;
    let subtotal = cesta.price;

    // Itens personalizados
    Object.entries(selectedItems).forEach(([categoryName, item]) => {
      if (item.option && item.quantity > 0) {
        const category = cesta.customizationOptions?.find(
          (c) => c.category === categoryName
        );
        const pricePerItem = category?.pricePerItem || 0;
        subtotal += pricePerItem * item.quantity;
      }
    });

    // Taxa de mídia (áudio ou vídeo)
    if (audioUrl || videoUrl) {
      subtotal += cesta.mediaPersonalizationFee ?? 0;
    }

    return subtotal;
  }, [selectedItems, audioUrl, videoUrl, cesta]);

  // 🔹 Adicionar ao carrinho
  const handleAddToCart = () => {
    if (!cesta) return;
    const productForCart = {
      id: cesta.id,
      title: cesta.title,
      price: total,
      image: Array.isArray(cesta.image) ? cesta.image[0] : cesta.image,
    };
    addToCart(productForCart);
  };

  // 🔹 Handlers
  const handleOptionChange = (category: string, value: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        option: value,
        quantity: prev[category]?.quantity || 1,
      },
    }));
  };

  const handleQuantityChange = (category: string, value: string) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setSelectedItems((prev) => ({
      ...prev,
      [category]: { ...prev[category], quantity: qty },
    }));
  };

  const addNewCategory = (category: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: { option: '', quantity: 1 },
    }));
  };

  const handleUploadAudio = () => {
    // Simulação – em produção, use upload para Firebase Storage
    setAudioUrl('https://example.com/audio.mp3');
  };

  const handleUploadVideo = () => {
    // Simulação – em produção, use upload para Firebase Storage
    setVideoUrl('https://example.com/video.mp4');
  };


  // 🔹 Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <p className="text-gray-600">Carregando opções de personalização...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 🔹 Erro
  if (error || !cesta) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center">
          <p className="text-red-600 mb-4">{error || 'Cesta não encontrada.'}</p>
          <Link
            href={`/cestas/${id}`}
            className="text-red-900 hover:underline font-medium flex items-center gap-1"
          >
            ← Voltar para a cesta
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="flex items-center mb-6">
          <Link
            href={`/cestas/${id}`}
            className="text-red-900 hover:underline flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar para detalhes
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Personalizar Cesta
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Selecione os itens e quantidades desejadas.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
          {cesta.customizationOptions && cesta.customizationOptions.length > 0 ? (
            cesta.customizationOptions.map((cat, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <h2 className="font-semibold text-lg text-gray-800 mb-3">
                  {cat.category}
                </h2>

                <select
                  value={selectedItems[cat.category]?.option || ''}
                  onChange={(e) =>
                    handleOptionChange(cat.category, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md mb-3"
                >
                  <option value="">Selecione</option>
                  {cat.options.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Quantidade"
                  value={selectedItems[cat.category]?.quantity || ''}
                  onChange={(e) =>
                    handleQuantityChange(cat.category, e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md mb-3"
                />

                <button
                  onClick={() => addNewCategory(cat.category)}
                  className="text-red-900 flex items-center gap-1 text-sm font-medium"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Adicionar novo
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Nenhuma opção de personalização disponível.
            </p>
          )}

          {/* 🔹 Áudio/Vídeo */}
          <div className="border-t pt-6 mt-6">
            <h2 className="font-semibold text-lg text-gray-800 mb-3">
              Vídeo ou Áudio Personalizado (opcional)
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Adicional de R${' '}
              {(cesta.mediaPersonalizationFee ?? 0).toFixed(2)} será adicionado.
            </p>

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

          {/* 🔹 Resumo de preço */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Preço base</span>
              <span className="font-medium">R$ {cesta.price.toFixed(2)}</span>
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

          {/* 🔹 Botões */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full font-semibold border-2 border-red-900 text-red-900 py-3 rounded-full hover:bg-red-50 transition flex justify-center items-center gap-2"
            >
              <svg
                className="w-6 h-6 text-red-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6m0 0h9"
                />
              </svg>
              Adicionar ao carrinho
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
