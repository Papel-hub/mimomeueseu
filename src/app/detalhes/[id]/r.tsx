'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Acao from '../components/Acao';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { Cesta } from '@/types/cesta';
import CestaActions from '../components/CestaActions';
import { FaEdit, FaBox } from 'react-icons/fa';



export default function CestaDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const [cesta, setCesta] = useState<Cesta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainMedia, setMainMedia] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<'cesta' | 'maleta' |'bandeja' | 'caixa'>('cesta');

  // Verifica se o parâmetro "format" está presente na URL
type FormatoValido = 'cesta' | 'maleta' | 'bandeja' | 'caixa';

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const formatFromUrl = urlParams.get('format');

  // Verifica se o formato está na lista de válidos
  if (formatFromUrl && ['cesta', 'maleta', 'bandeja', 'caixa'].includes(formatFromUrl)) {
    // Agora o TypeScript reconhece que é um tipo válido
    setSelectedFormat(formatFromUrl as FormatoValido);
  }
}, []);

  useEffect(() => {
    if (!id) {
      setError('ID da cesta não especificado.');
      setLoading(false);
      return;
    }

    const fetchCesta = async () => {
      try {
        const docRef = doc(db, 'cestas', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Cesta não encontrada.');
          return;
        }

        const data = docSnap.data() as DocumentData;

        const cestaData: Cesta = {
          id: docSnap.id,
          title: typeof data.title === 'string' ? data.title : 'Cesta sem nome',
          price: typeof data.price === 'number' ? data.price : 0,
          rating: typeof data.rating === 'number' ? data.rating : 0,
          reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
          description: typeof data.description === 'string'
            ? data.description
            : 'Descrição não disponível.',
          video: typeof data.video === 'string' ? data.video : undefined,
          image: Array.isArray(data.image) ? data.image.filter((img: unknown) => typeof img === 'string') : ['/images/p1.png'],
          items: Array.isArray(data.items) ? data.items.filter((item: unknown) => typeof item === 'string') : ['Item não informado'],
          nutritionalInfo: {
            calories: typeof data.nutritionalInfo?.calories === 'string' ? data.nutritionalInfo.calories : 'Não informado',
            origin: typeof data.nutritionalInfo?.origin === 'string' ? data.nutritionalInfo.origin : 'Não informado',
            certification: typeof data.nutritionalInfo?.certification === 'string' ? data.nutritionalInfo.certification : 'Não informado',
          },
          formatOptions: {
            cesta: typeof data.formatOptions?.cesta === 'number' ? data.formatOptions.cesta : 0,
            maleta: typeof data.formatOptions?.maleta === 'number' ? data.formatOptions.maleta : 0,
            bandeja: typeof data.formatOptions?.bandeja === 'number' ? data.formatOptions.bandeja : 0,
            caixa: typeof data.formatOptions?.caixa === 'number' ? data.formatOptions.caixa : 0,
          },
        };

        setCesta(cestaData);
        setMainMedia(cestaData.video || null);
      } catch (err) {
        console.error('Erro ao carregar cesta:', err);
        setError('Não foi possível carregar os detalhes da cesta.');
      } finally {
        setLoading(false);
      }
    };
    fetchCesta();
  }, [id]);

  // Atualiza mídia principal ao clicar nas miniaturas
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setMainMedia(null);
  };

  // Calcula preço final baseado no formato
  const finalPrice = useMemo(() => {
    if (!cesta) return 0;
    const basePrice = cesta.price;
    const extra = cesta.formatOptions?.[selectedFormat] ?? 0;
    return basePrice + extra;
  }, [cesta, selectedFormat]);

  // Função para lidar com o checkout
  const handleCheckout = () => {
    // Atualiza a URL para incluir o formato selecionado
    const newUrl = `${window.location.pathname}?format=caixa`;
    window.history.replaceState({}, '', newUrl);
    // Força a seleção do formato "caixa"
    setSelectedFormat('caixa');
  };

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center animate-pulse">
          <div className="flex justify-center items-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600">Carregando detalhes da cesta...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Erro
  if (error || !cesta) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center animate-fade-in">
          <p className="text-red-600 mb-4">{error || 'Cesta não encontrada.'}</p>
          <button
            onClick={() => router.push("/cestas")}
            className="bg-red-900 text-white px-6 py-3 rounded-full font-medium shadow hover:bg-red-800 transition animate-bounce"
          >
            Ver cestas
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // Renderização principal
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 pt-24 sm:pt-28 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Galeria */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-3 items-center">
              {/* Botão do vídeo (se existir) */}
              {cesta.video && (
                <button
                  onClick={() => setMainMedia(cesta.video!)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all animate-pulse ${
                    mainMedia === cesta.video
                      ? 'border-green-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="bg-black text-white text-xs flex items-center justify-center w-full h-full">
                    ▶️
                  </div>
                </button>
              )}

              {/* Limita a 3 imagens */}
              {cesta.image.slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all animate-fade-in ${
                    !mainMedia && selectedImageIndex === idx
                      ? 'border-green-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            <div className="bg-gray-100 rounded-xl flex items-center justify-center w-full max-w-[500px] max-h-[425px] animate-scale-in">
              {mainMedia ? (
                <video src={mainMedia} controls className="w-full h-full object-contain rounded-xl" poster={cesta.image[0]} />
              ) : (
                <Image 
                  src={cesta.image[selectedImageIndex]} 
                  alt={cesta.title} 
                  width={400} 
                  height={400} 
                  className="object-contain w-full h-full animate-fade-in" 
                />
              )}
            </div>
          </div>

          {/* Informações da cesta */}
          <div className="flex flex-col gap-4 animate-slide-in">
            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">{cesta.title}</h1>
            <div className="flex items-center animate-fade-in">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-5 w-5 ${i < Math.floor(cesta.rating) ? 'text-yellow-400' : 'text-gray-300'} animate-pulse`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">{cesta.rating} ({cesta.reviewCount} avaliações)</span>
            </div>
            <p className="text-gray-700 animate-fade-in">{cesta.description}</p>

            {/* Formato */}
            <div className="animate-fade-in">
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                Escolha o formato da cestaria:
              </h2>
              <div className="flex flex-wrap gap-4">
                {(['cesta', 'maleta', 'bandeja', 'caixa'] as const).map((format) => {
                  const labels: Record<typeof format, string> = {
                    cesta: 'Cesta',
                    maleta: 'Maleta',
                    bandeja: 'Bandeja',
                    caixa: 'Caixa Mimo',
                  };

                  const extra = cesta?.formatOptions?.[format] ?? 0;

                  return (
                    <label
                      key={format}
                      className={`flex items-center border rounded-lg px-3 py-2 cursor-pointer transition animate-fade-in ${
                        selectedFormat === format
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-300'
                      }`}
                      style={{ animationDelay: `${format === 'caixa' ? '300ms' : '0ms'}` }}
                    >
                      <input
                        type="radio"
                        name="format"
                        checked={selectedFormat === format}
                        onChange={() => setSelectedFormat(format)}
                        className="sr-only"
                      />
                      <span className="text-gray-700 font-medium flex items-center">
                        {format === 'caixa' && (
                          <FaBox
                            className="mr-2 text-red-900" 
                          />
                        )}
                        {labels[format]}
                      </span>
                      {extra > 0 && (
                        <span className="ml-2 text-sm text-green-600">
                          + R$ {extra.toFixed(2)}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <p className="text-2xl font-bold text-red-900 animate-fade-in">VALOR: R$ {finalPrice.toFixed(2)}</p>

            <div className="p-4 bg-red-50 rounded-lg animate-fade-in">
              <h3 className="font-medium text-red-900">⚠️Envio pelos Correios/Transportadoras:</h3>
              <ul className="mt-2 text-sm px-4 text-gray-700 space-y-1">
                <li>• Apenas maletas e produtos não perecíveis</li>
                <li>• Outras opções disponíveis via delivery</li>
              </ul>
            </div>

            <CestaActions 
              cestaId={id!} 
              selectedFormat={selectedFormat} 
              onCheckout={handleCheckout}
            />
          </div>
        </div> 


        <Acao />
      </main>
      <Footer />
    </div>
  );
} 