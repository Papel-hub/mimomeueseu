// app/pagamento/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

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
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pagamento</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Finalize sua compra com segurança.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-2 text-center">
          <p className="text-gray-700">
            Total da compra:
            <span className="ml-2 font-bold text-lg text-gray-900">
              R$ {cartTotal.toFixed(2).replace('.', ',')}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 space-y-6 max-w-md mx-auto">
          <PaymentMethodSelector value={metodo} onChange={setMetodo} />

          {metodo === 'pix' && (
            <PixPaymentSection
              cartTotal={cartTotal}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}