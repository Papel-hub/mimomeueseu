'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Cesta, CustomizationOption } from '@/types/cesta';

export default function MensagemPage() {
  const params = useParams();
  const id = params.id as string;
  const [cesta, setCesta] = useState<Cesta | null>(null);
  const { addToCart } = useCart();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');


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

        // Validação de customizationOptions
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

        // Validação dos demais campos
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
  }, [id]);

const handleAddToCart = () => {
  if (!cesta) return;

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
};


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
       <Header />
       <div className="flex items-center justify-center min-h-screen">
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
        <p>Erro: {error}</p>
        <Link href="/cestas" className="mt-4 text-red-900 hover:underline">
          Voltar para as cestas
        </Link>
       <Footer />
      </div>
    );
  }

  if (!cesta) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Cesta não encontrada.</p>
        <Link href="/cestas" className="mt-4 text-red-900 hover:underline">
          Ver todas as cestas
        </Link>
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Cartão de Mensagem</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Preencha os campos abaixo para enviar um cartão junto à sua cesta
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">

        <div className="relative flex justify-center">
          {/* A imagem da carta */}
          <Image
            src="/images/carta.svg"
            alt="Cartão de mensagem"
            width={450}
            height={450}
            className="object-contain w-full max-w-xs select-none"
          />
           <div className="font-semibold text-xs absolute
            top-[50%] left-[13%] text-gray-800 w-[30%] h-[4%]
            whitespace-pre-line break-words overflow-hidden">
              {!isChecked && from ? `${from}` : 'Digite o nome'}
            </div>
            <div className="font-semibold text-xs absolute
             top-[54.5%] left-[15%] text-gray-800 w-[30%] h-[4%]
             whitespace-pre-line break-words overflow-hidden">
              {to ? `${to}` : 'Digite o nome'}
            </div>

            <div className="mt-2 w-[35%] text-xs absolute
             top-[62%] left-[8%] text-gray-700 italic 
             whitespace-pre-line break-words
              max-h-[120px] overflow-hidden">
              {message || 'Sua mensagem...'}
            </div>
        </div>


          <div className="flex justify-center items-center gap-3 font-sans">
            <label className="toggle-switch relative inline-block h-6 w-12 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="peer sr-only"
                aria-label="Enviar de forma anônima"
              />
              <span
                className={`slider absolute inset-0 rounded-full transition-colors duration-300 ${
                  isChecked ? 'bg-[#9e2121]' : 'bg-gray-300'
                }`}
              />
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                  isChecked ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </label>
            <span className="text-sm text-gray-800 font-bold">Enviar de forma anônima</span>
          </div>

          <div className="border-t pt-6 mt-6 space-y-4">
<div>
  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
    De:
  </label>
  <input
    id="from"
    type="text"
    placeholder="Digite o seu nome"
    className="w-full p-2 border border-gray-300 rounded-md"
    value={from}
    onChange={(e) => setFrom(e.target.value)}
    disabled={isChecked}
  />
</div>

<div>
  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
    Para:
  </label>
  <input
    id="to"
    type="text"
    placeholder="Digite o nome de quem deseja"
    className="w-full p-2 border border-gray-300 rounded-md"
    value={to}
    onChange={(e) => setTo(e.target.value)}
  />
</div>

<div>
  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
    Mensagem:
  </label>
  <textarea
    id="message"
    placeholder="Escreva sua mensagem aqui..."
    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:outline-none"
    rows={3}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
</div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleAddToCart}
              className="w-full font-semibold border border-red-900 text-white py-3 rounded-full hover:bg-red-800 bg-red-900 transition flex justify-center items-center gap-2"
            >
              <svg
                className="w-6 h-6"
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
              className="w-full flex items-center justify-center gap-2 font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-50 transition text-center"
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