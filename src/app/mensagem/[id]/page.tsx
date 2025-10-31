'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Cesta, CustomizationOption } from '@/types/cesta';

import { useRouter, useParams } from 'next/navigation';
import MensagemPreview from '../components/MensagemPreview';
import { FormatoTipo } from '../components/FormatoSelector';
import MensagemForm from '../components/MensagemForm';
import BtnCoracao from '../components/BtnCoracao';
import CartasDoCoracaoSelector from '../components/CartasDoCoracaoSelector';
import AudioUpload from '../components/AudioUpload';

const cartasDoCoracao = [
  "Para Declarar",
  "Com carinho e afeto, para você.",
  "Para Relembrar",
  "Para alguém especial, com muito carinho.",
  "Para Perguntar ou Revelar.",
];

export default function MensagemPage() {
  // ✅ Correção: useParams() deve ser chamado explicitamente
  const params = useParams();
  const id = params?.id;

  // Validação de ID
  const cestaId = typeof id === 'string' ? id : null;

  const [cesta, setCesta] = useState<Cesta | null>(null);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [usarCarta, setUsarCarta] = useState(false);
  const [mensagemSelecionada, setMensagemSelecionada] = useState('');
  const [selectedFormat] = useState<FormatoTipo>('digital');
  const [prices] = useState<Record<FormatoTipo, number>>({
    digital: 79,
    fisico: 129,
    digital_audio: 149,
    digital_video: 179,
    digital_fisico_audio: 249,
    full_premium: 319,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const router = useRouter();

  const handleGoToNextStep = () => {
    const mensagemFinal = usarCarta && mensagemSelecionada ? mensagemSelecionada : message;

    const mensagemData = {
      from: isChecked ? 'Anônimo' : from || '',
      to: to || '',
      message: mensagemFinal || '',
      format: selectedFormat,
      price: prices[selectedFormat],
      cestaId: cestaId || null,
      audioFile,
      timestamp: Date.now(),
    };

    localStorage.setItem('mimo_mensagem', JSON.stringify(mensagemData));

    const needsAudio = ['digital_audio', 'digital_fisico_audio', 'full_premium'].includes(selectedFormat);
    const needsVideo = ['digital_video', 'full_premium'].includes(selectedFormat);

    if (needsAudio && needsVideo) router.push('/midia?tipo=both');
    else if (needsVideo) router.push('/midia?tipo=video');
    else if (needsAudio) router.push('/midia?tipo=audio');
    else router.push('/entrega');
  };

  const handleCartaCoracaoClick = () => {
    setUsarCarta(true);
    setMensagemSelecionada(cartasDoCoracao[0]);
    setMessage('');
  };

  const handleAddToCart = () => {
    if (!cesta || !cestaId) return;

    const productForCart = {
      id: cesta.id,
      title: cesta.title,
      price: cesta.price + (cesta.mediaPersonalizationFee || 0),
      image: Array.isArray(cesta.image) ? cesta.image[0] : cesta.image,
      card: {
        anonymous: isChecked,
        from: isChecked ? null : from.trim() || null,
        to: to.trim() || null,
        message: message.trim() || null,
      },
    };

    addToCart(productForCart);
    router.push('/cestas'); // ou outra rota de sucesso
  };

  useEffect(() => {
    if (!cestaId) {
      setError('ID da cesta inválido.');
      setLoading(false);
      return;
    }

    const fetchCesta = async () => {
      try {
        const docRef = doc(db, 'cestas', cestaId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Cesta não encontrada.');
          return;
        }

        const data = docSnap.data();

        const customizationOptions: CustomizationOption[] = Array.isArray(data.customizationOptions)
          ? data.customizationOptions.filter(
              (opt): opt is CustomizationOption =>
                typeof opt === 'object' &&
                opt !== null &&
                typeof opt.category === 'string' &&
                Array.isArray(opt.options) &&
                opt.options.every((o: unknown) => typeof o === 'string') &&
                typeof opt.pricePerItem === 'number'
            )
          : [];

        const cestaData: Cesta = {
          id: docSnap.id,
          title: typeof data.title === 'string' ? data.title : 'Sem título',
          price: typeof data.price === 'number' ? data.price : 0,
          rating: typeof data.rating === 'number' ? data.rating : 0,
          reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
          description: typeof data.description === 'string' ? data.description : '',
          image: Array.isArray(data.image) && data.image.every((img: unknown) => typeof img === 'string')
            ? data.image
            : ['/placeholder.jpg'],
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
          customizationOptions,
          mediaPersonalizationFee:
            typeof data.mediaPersonalizationFee === 'number' ? data.mediaPersonalizationFee : 19.9,
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
  }, [cestaId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen text-gray-800">
          Carregando...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <p className="text-red-600 mb-4">Erro: {error}</p>
          <Link href="/cestas" className="text-red-900 hover:underline font-medium">
            Voltar para as cestas
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cesta) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <p className="text-gray-700 mb-4">Cesta não encontrada.</p>
          <Link href="/cestas" className="text-red-900 hover:underline font-medium">
            Ver todas as cestas
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Cartão de Mensagem</h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Preencha os campos e escolha o formato de envio
          </p>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
            <MensagemPreview from={from} to={to} message={message} isChecked={isChecked} />

            <MensagemForm
              isChecked={isChecked}
              onToggleAnonimo={setIsChecked}
              from={from}
              to={to}
              message={message}
              onFromChange={setFrom}
              onToChange={setTo}
              onMessageChange={(msg) => {
                setMessage(msg);
                setUsarCarta(false);
                setMensagemSelecionada('');
              }}
            />

            <BtnCoracao onClick={handleCartaCoracaoClick} />

            {usarCarta && (
              <CartasDoCoracaoSelector
                cartas={cartasDoCoracao}
                selected={mensagemSelecionada}
                onSelect={(frase) => {
                  setMensagemSelecionada(frase);
                  setMessage(frase);
                  setUsarCarta(false);
                }}
              />
            )}

            <AudioUpload
              audioFile={audioFile}
              setAudioFile={setAudioFile}
              selectedFormat={selectedFormat}
            />



            <div className="space-y-3">
              <button
                onClick={handleGoToNextStep}
              className="w-full font-semibold border-2 border-red-900 text-white py-3 rounded-full hover:bg-red-800 bg-red-900 transition flex justify-center items-center gap-2"
              >
      
                  Continuar
                 
              </button>

              <button
                onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}