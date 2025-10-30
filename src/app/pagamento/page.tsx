// app/pagamento/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useParams } from "next/navigation";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Components
import PaymentMethodSelector from './components/PaymentMethodSelector';
import PixPaymentSection from './components/PixPaymentSection';
import CreditCardPaymentSection from './components/CreditCardPaymentSection';
import MimoCardSection from './components/MimoCardSection';
import BoletoPaymentSection from './components/BoletoPaymentSection';

type PaymentMethod = 'pix' | 'cartaomimo' | 'cartao' | 'boleto' | '';

interface PaymentResponse {
  success: boolean;
  data?: { qr_code?: string; qr_code_base64?: string; boleto_url?: string; status?: string };
  error?: string;
}

export default function PagamentoPage() {
  const router = useRouter();
  const { cartItems, cartTotal } = useCart();
  const [metodo, setMetodo] = useState<PaymentMethod>('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pixKey, setPixKey] = useState<string | null>(null);
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
    const params = useParams(); 
    const id = params.id as string; 
    const [paymentType, setPaymentType] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) router.push('/carrinho');
  }, [cartItems, router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) setEmail(user.email);
    });
    return () => unsubscribe();
  }, []);
const handleBoletoPayment = async (boletoData: {
  first_name: string;
  last_name: string;
  identification: { type: string; number: string };
}) => {
  setLoading(true);
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: cartTotal,
        email,
        description: 'Pagamento Mimo',
        method: 'boleto',
        ...boletoData,
      }),
    });

    const data: PaymentResponse = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao gerar boleto');

    if (data.data?.boleto_url) {
      setBoletoUrl(data.data.boleto_url);
    }
  } catch (err) {
    console.error(err);
    alert('Não foi possível gerar o boleto.');
  } finally {
    setLoading(false);
  }
};
  const handlePayment = async (method: 'pix' | 'boleto') => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          email,
          description: 'Pagamento Mimo',
          method: method === 'pix' ? 'pix' : 'boleto',
        }),
      });

      const data: PaymentResponse = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || 'Erro ao gerar pagamento');

      if (method === 'pix' && data.data?.qr_code && data.data.qr_code_base64) {
        setQrCode(`data:image/png;base64,${data.data.qr_code_base64}`);
        setPixKey(data.data.qr_code);
      }

      if (method === 'boleto' && data.data?.boleto_url) {
        setBoletoUrl(data.data.boleto_url);
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">


        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Padamento
        </h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Cadastre pessoas especiais
        </p>

        <div className="max-w-md mx-auto mb-2 text-center">
          <p className="text-gray-700">
            Total da compra:
            <span className="ml-2 font-bold text-lg text-gray-900">
              R$ {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </p>
        </div>

          {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8 max-w-lg mx-auto">
          <PaymentMethodSelector value={metodo} onChange={setMetodo} />

          {metodo === 'pix' && (
            <PixPaymentSection
              email={email}
              onEmailChange={setEmail}
              onGeneratePix={() => handlePayment('pix')}
              loading={loading}
              qrCode={qrCode}
              pixKey={pixKey}
            />
          )}

          {metodo === 'cartao' && <CreditCardPaymentSection cartTotal={cartTotal} />}

          {metodo === 'cartaomimo' && <MimoCardSection cartTotal={cartTotal} />}

          {metodo === 'boleto' && (
            <BoletoPaymentSection
              email={email}
              onEmailChange={setEmail}
              onGenerateBoleto={handleBoletoPayment}
              loading={loading}
              boletoUrl={boletoUrl}
            />
          )}

                          {/* Botões de ação */}
                <div className="space-y-3 pt-2">

      
                  <Link
                    href="/cestas"
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