'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, DocumentData } from 'firebase/firestore';

// Tipos
import { Cesta } from '@/types/cesta';

// Componentes de Layout
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Acao from '../components/Acao';
import CestaActions from '../components/CestaActions';

// Componentes Internos (Extraídos)
import ProductGallery from '../components/ProductGallery';
import FormatSelector from '../components/FormatSelector';
import ProductInclusions from '../components/ProductInclusions';
import ReviewsSection from '../components/ReviewsSection';
import ProductHeader from '../components/ProductHeader';

export type FormatoValido = 'cesta' | 'maleta' | 'bandeja' | 'caixa';

export default function CestaDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  // Estados
  const [cesta, setCesta] = useState<Cesta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainMedia, setMainMedia] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<FormatoValido>('cesta');

  // 1. Sincronização de Formato via URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const formatFromUrl = urlParams.get('format') as FormatoValido;
    const formatos: FormatoValido[] = ['cesta', 'maleta', 'bandeja', 'caixa'];

    if (formatFromUrl && formatos.includes(formatFromUrl)) {
      setSelectedFormat(formatFromUrl);
    }
  }, []);

  // 2. Busca de Dados no Firebase
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
          title: data.title || 'Cesta sem nome',
          price: Number(data.price) || 0,
          rating: Number(data.rating) || 0,
          reviewCount: Number(data.reviewCount) || 0,
          description: data.description || 'Descrição não disponível.',
          video: data.video || undefined,
          image: Array.isArray(data.image) ? data.image : ['/images/p1.png'],
          items: Array.isArray(data.items) ? data.items : [],
          nutritionalInfo: {
            calories: data.nutritionalInfo?.calories || 'Não informado',
            origin: data.nutritionalInfo?.origin || 'Não informado',
            certification: data.nutritionalInfo?.certification || 'Não informado',
          },
          formatOptions: {
            cesta: Number(data.formatOptions?.cesta) || 0,
            maleta: Number(data.formatOptions?.maleta) || 0,
            bandeja: Number(data.formatOptions?.bandeja) || 0,
            caixa: Number(data.formatOptions?.caixa) || 0,
          },
        };

        setCesta(cestaData);
      } catch (err) {
        console.error('Erro ao carregar cesta:', err);
        setError('Não foi possível carregar os detalhes.');
      } finally {
        setLoading(false);
      }
    };

    fetchCesta();
  }, [id]);

  // 3. Cálculos e Handlers
  const finalPrice = useMemo(() => {
    if (!cesta) return 0;
    const extra = cesta.formatOptions?.[selectedFormat] ?? 0;
    return cesta.price + extra;
  }, [cesta, selectedFormat]);

  const handleCheckout = useCallback(() => {
    const newUrl = `${window.location.pathname}?format=caixa`;
    window.history.replaceState({}, '', newUrl);
    setSelectedFormat('caixa');
  }, []);

  // 4. Estados de Carregamento e Erro
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !cesta) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center pt-24 px-4 text-center">
          <p className="text-red-600 mb-4 font-medium">{error || 'Cesta não encontrada.'}</p>
          <button onClick={() => router.push("/cestas")} className="bg-red-900 text-white px-6 py-2 rounded-full">
            Ver todas as cestas
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // 5. Renderização Principal
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 sm:pt-28 pb-12 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Lado Esquerdo: Visual */}
          <ProductGallery 
            images={cesta.image} 
            video={cesta.video}
            mainMedia={mainMedia}
            setMainMedia={setMainMedia}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            title={cesta.title}
          />

          {/* Lado Direito: Informações e Compra */}
          <div className="flex flex-col gap-6">
            <ProductHeader 
              title={cesta.title} 
              rating={cesta.rating} 
              reviewCount={cesta.reviewCount} 
            />

            <p className="text-gray-700 leading-relaxed">{cesta.description}</p>

            <FormatSelector 
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              formatOptions={cesta.formatOptions}
            />

            <div className="py-4 border-y border-gray-100">
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Valor Final</span>
              <p className="text-3xl font-black text-red-900">R$ {finalPrice.toFixed(2)}</p>
            </div>

            {/* Aviso de Entrega */}
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <h3 className="text-sm font-bold text-red-900">⚠️ Envio via Transportadora:</h3>
              <p className="text-xs text-gray-700 mt-1">Disponível apenas para Maletas e itens não perecíveis.</p>
            </div>

            <CestaActions 
              cestaId={id!} 
              selectedFormat={selectedFormat} 
              onCheckout={handleCheckout}
            />
          </div>
        </div> 

        {/* Seção Inferior: Detalhes e Prova Social */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductInclusions 
            id={id!}
            items={cesta.items} 
            nutritionalInfo={cesta.nutritionalInfo} 
          />
          
          <ReviewsSection 
            reviewCount={cesta.reviewCount} 
          />
        </div>

        <div className="mt-12">
          <Acao />
        </div>
      </main>

      <Footer />
    </div>
  );
}