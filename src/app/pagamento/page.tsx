'use client';
import { useParams } from "next/navigation";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PagamentoPage() {
  const params = useParams(); 
  const id = params.id as string; 
  const [paymentType, setPaymentType] = useState('');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        {/* Voltar */}
        <div className="flex items-center mb-6">
          <Link
            href={`/cestas/${id}`}
            className="text-red-900 hover:underline flex items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Voltar para detalhes
          </Link>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Pagamento
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Escolha uma forma de pagamento e finalize seu pedido.
        </p>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8 max-w-lg mx-auto">
          {/* Seletor de pagamento */}
          <div>
            <label htmlFor="pagamento" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de pagamento
            </label>
            <select
              id="pagamento"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900"
            >
              <option value="">Selecione o tipo</option>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          {/* Campos dinâmicos */}
          {paymentType === 'pix' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/qr-pix.png"
                  alt="QR Code PIX"
                  width={150}
                  height={150}
                  className="rounded-lg border border-gray-200"
                />
                <p className="text-sm text-gray-600 mt-3">
                  Escaneie o QR Code ou copie a chave abaixo:
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chave PIX</label>
                <input
                  type="text"
                  value="pagamento@meusite.com"
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 select-all"
                />
              </div>
            </div>
          )}

          {paymentType === 'cartao' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número do cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="space-y-3 pt-2">
            <button
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 shadow-sm transition-all"
            >
              Confirmar pagamento
            </button>

            <Link
              href={`/cestas/${id}`}
              className="w-full flex items-center justify-center gap-2 font-semibold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
          </div>

          {/* Separador */}
          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OU</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Alternativas de pagamento */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-full hover:bg-gray-50 font-medium transition">
              <Image src="/images/google-logo.png" alt="Google Pay" width={24} height={24} />
              Pagar com Google Pay
            </button>

            <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-300 rounded-full hover:bg-gray-50 font-medium transition">
              <Image src="/images/apple-50.png" alt="Apple Pay" width={24} height={24} />
              Pagar com Apple Pay
            </button>

            <button className="w-full flex items-center justify-center gap-3 p-3 border border-green-600 text-green-600 rounded-full hover:bg-green-50 font-medium transition">
              <Image src="/images/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
              Finalizar via WhatsApp
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
