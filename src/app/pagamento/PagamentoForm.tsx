'use client';

import { useEffect, useState, useRef } from 'react';
import { Payment, initMercadoPago } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { CartItem } from '@/contexts/CartContext';

// Função para obter carrinho do localStorage
const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('cartItems');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const isValidCartItem = (item: unknown): item is CartItem => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('id' in item) || !('price' in item) || !('quantity' in item)) return false;
      const id = (item as { id: unknown }).id;
      const price = (item as { price: unknown }).price;
      const quantity = (item as { quantity: unknown }).quantity;
      return (
        typeof id === 'string' &&
        typeof price === 'number' &&
        typeof quantity === 'number' &&
        quantity > 0
      );
    };
    return parsed.filter(isValidCartItem);
  } catch (e) {
    console.warn('Carrinho corrompido. Limpando...');
    localStorage.removeItem('cartItems');
    return [];
  }
};

export default function PagamentoForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const cartRef = useRef(getCartFromStorage());

  // ✅ Calcula o total localmente (só para o Brick)
  const totalAmount = cartRef.current.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const amount = Number(totalAmount.toFixed(2));

  // Redireciona se o carrinho estiver vazio
  useEffect(() => {
    if (cartRef.current.length === 0) {
      router.push('/carrinho');
    }
  }, [router]);

  // Inicializa o SDK do Mercado Pago
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      setError('Erro de configuração. Tente novamente mais tarde.');
      return;
    }
    initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'pt-BR' });
  }, []);

  const customization = {
    paymentMethods: {
      ticket: 'all' as const,
      bankTransfer: 'all' as const,
      creditCard: 'all' as const,
      debitCard: 'all' as const,
      mercadoPago: 'all' as const,
    },
  };

  const onSubmit = async (paymentData: unknown) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user?.email) {
      setError('É necessário estar logado com um e-mail válido.');
      return Promise.reject(new Error('E-mail do pagador ausente'));
    }

    if (!paymentData || typeof paymentData !== 'object') {
      setError('Dados de pagamento inválidos.');
      return Promise.reject(new Error('paymentData inválido'));
    }

    const pd = paymentData as Record<string, unknown>;
    const paymentMethodId = pd.selectedPaymentMethod as string;

    if (!paymentMethodId) {
      setError('Método de pagamento não selecionado.');
      return Promise.reject(new Error('payment_method_id ausente'));
    }

    const methodsWithoutToken = ['pix', 'bolbr', 'bank_transfer'];
    const isCard = !methodsWithoutToken.includes(paymentMethodId);

    if (isCard && (typeof pd.token !== 'string' || !pd.token)) {
      setError('Token de pagamento ausente.');
      return Promise.reject(new Error('token ausente para cartão'));
    }

    const payload: Record<string, unknown> = {
      payment_method_id: paymentMethodId,
      cartItems: cartRef.current,
      payer: {
        email: user.email,
      },
    };

    if (isCard && typeof pd.token === 'string') {
      payload.token = pd.token;
    }

    if (typeof pd.installments === 'number') {
      payload.installments = pd.installments;
    }

    const idempotencyKey = crypto.randomUUID();

    try {
      const response = await fetch('/api/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro no pagamento:', data);
        setError(data?.message || 'Erro ao processar pagamento');
        return Promise.reject(data);
      }

      console.log('✅ Pagamento criado com sucesso:', data);
      router.push('/confirmacao-pagamento');
      return data;
    } catch (err) {
      console.error('Erro no onSubmit:', err);
      setError('Erro inesperado ao processar o pagamento.');
      return Promise.reject(err);
    }
  };

  const onError = (error: unknown) => {
    console.error('❌ Erro no Payment Brick:', error);
    setError('Erro ao carregar opções de pagamento');
  };

  const onReady = () => {
    console.log('✅ Payment Brick pronto!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 space-y-8 max-w-lg mx-auto">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="pt-4 min-h-[500px]">
        <Payment
          initialization={{ amount }}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      </div>
    </div>
  );
}