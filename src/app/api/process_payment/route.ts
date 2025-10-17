// src/app/api/process_payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from '@/lib/firebaseConfig';

// Validação de variável de ambiente
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error('MP_ACCESS_TOKEN não está definido nas variáveis de ambiente.');
}

// Cria cliente do Mercado Pago (v2+)
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const paymentService = new Payment(client);

// --- Tipos ---
interface CartItem {
  id: string;
  quantity: number;
}

interface ProcessPaymentRequestBody {
  token?: string;
  payment_method_id: string;
  installments?: number;
  cartItems: CartItem[];
  payer: {
    email: string;
  };
}

interface MercadoPagoPaymentRequest {
  transaction_amount: number;
  description: string;
  installments: number;
  payment_method_id: string;
  payer: { email: string };
  token?: string;
}

interface MercadoPagoPaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  payment_method_id: string;
  transaction_details?: {
    net_received_amount?: number;
    total_paid_amount?: number;
    external_resource_url?: string;
  };
}

const METHODS_WITHOUT_TOKEN = ['pix', 'bolbradesco', 'bank_transfer'];
const SUPPORTED_METHODS = [...METHODS_WITHOUT_TOKEN, 'visa', 'master', 'amex'];

function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  return trimmed.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProcessPaymentRequestBody;

    const payerEmail = body.payer?.email;
    if (!isValidEmail(payerEmail)) {
      return NextResponse.json({ message: 'E-mail do pagador inválido.' }, { status: 400 });
    }

    const cartItems = body.cartItems;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ message: 'Carrinho vazio ou inválido.' }, { status: 400 });
    }

    if (!SUPPORTED_METHODS.includes(body.payment_method_id)) {
      return NextResponse.json({ message: 'Método de pagamento não suportado.' }, { status: 400 });
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      if (!item.id || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json({ message: 'Item inválido no carrinho.' }, { status: 400 });
      }

      const cestaDoc = await getDoc(doc(db, 'cestas', item.id));
      if (!cestaDoc.exists()) {
        return NextResponse.json({ message: `Cesta ${item.id} não encontrada.` }, { status: 400 });
      }

      const cestaData = cestaDoc.data();
      const price = typeof cestaData.price === 'number' ? cestaData.price : 0;
      if (price <= 0) {
        return NextResponse.json({ message: `Cesta ${item.id} sem preço definido.` }, { status: 400 });
      }

      totalAmount += price * item.quantity;
    }

    const transactionAmount = Number(totalAmount.toFixed(2));

    const isCard = !METHODS_WITHOUT_TOKEN.includes(body.payment_method_id);
    if (isCard && (!body.token || typeof body.token !== 'string')) {
      return NextResponse.json({ message: 'Token de cartão ausente.' }, { status: 400 });
    }

    const paymentBody: MercadoPagoPaymentRequest = {
      transaction_amount: transactionAmount,
      description: 'Compra de cestas personalizadas',
      installments: body.installments ?? 1,
      payment_method_id: body.payment_method_id,
      payer: { email: payerEmail },
    };

    if (isCard) {
      paymentBody.token = body.token;
    }

    // ✅ Nova forma de criar pagamento (v2+)
    const payment = await paymentService.create({ body: paymentBody });

    return NextResponse.json(
      {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        payment_method_id: payment.payment_method_id,
        transaction_details: payment.transaction_details,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error & { context?: { message?: string; cause?: Array<{ description?: string }> } };

    console.error('❌ Erro ao processar pagamento:', {
      message: err.message,
      context: err.context,
    });

    const mpError = err.context;
    if (mpError) {
      const message = mpError.message || 'Erro no pagamento';
      const cause = mpError.cause?.[0]?.description || '';
      const fullMessage = `${message} ${cause}`.trim();
      return NextResponse.json({ message: fullMessage }, { status: 400 });
    }

    return NextResponse.json(
      { message: err.message || 'Erro interno no servidor de pagamento.' },
      { status: 500 }
    );
  }
}