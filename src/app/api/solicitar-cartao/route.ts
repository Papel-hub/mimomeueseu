// app/api/solicitar-cartao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';
import { CardActivationEmail } from '@/emails/CardActivationEmail';
import { createHash } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// --------------------- Tipos ---------------------
interface Endereco {
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
  cep: string;
}

interface SolicitarCartaoBody {
  tipo: 'fisico' | 'digital';
  modo: 'proprio' | 'presente';
  nome: string;
  email: string;
  mensagem?: string;
  endereco?: Endereco;
}

// --------------------- Funções auxiliares ---------------------
function generateCardNumber(): string {
  const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
  return `MIMO${digits}`;
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function hashPin(pin: string): string {
  return createHash('sha256').update(pin).digest('hex');
}

function generateExpiry(): string {
  const now = new Date();
  const expiryYear = now.getFullYear() + 2;
  const expiryMonth = String(now.getMonth() + 1).padStart(2, '0');
  return `${expiryMonth}/${String(expiryYear).slice(2)}`;
}

function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString();
}

function generateActivationToken(): string {
  return Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('');
}

// --------------------- Endpoint ---------------------
export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const senderEmail = decodedToken.email || '';
    const senderName = decodedToken.name || 'Usuário';

    // 2️⃣ Recebe e valida body
    const body: SolicitarCartaoBody = await req.json();
    const { tipo, modo, nome, email, mensagem, endereco } = body;

    if (!tipo || !modo || !nome || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (tipo === 'fisico' && (!endereco || !endereco.cep || endereco.cep.length !== 8)) {
      return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
    }

    // 3️⃣ Geração do cartão
    const cardNumber = generateCardNumber();
    const pin = generatePin();
    const validade = generateExpiry();
    const cvv = generateCVV();
    const activationToken = generateActivationToken();

    const cardData = {
      number: cardNumber,
      pinHash: hashPin(pin),
      validade,
      cvv,
      tipo,
      modo,
      nome,
      email,
      mensagem: modo === 'presente' ? mensagem || null : null,
      ...(tipo === 'fisico' && { endereco }),
      status: 'active',
      cardStatus: 'pending_activation',
      activationToken,
      activationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    let resultData: Record<string, unknown>;

    if (modo === 'presente') {
      const giftId = db.collection('gifts').doc().id;
      await db.collection('gifts').doc(giftId).set({
        ...cardData,
        giftId,
        senderUid: uid,
        senderEmail,
        senderName,
      });

      const activationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/ativar?token=${activationToken}&giftId=${giftId}`;
      await resend.emails.send({
        from: 'MIMO <cartoes@mimo.com>',
        to: email,
        subject: `Você recebeu um cartão MIMO!`,
        react: CardActivationEmail({
          recipientName: nome,
          isGift: true,
          activationLink,
          senderName,
          message: mensagem || undefined,
        }),
      });

      resultData = { success: true, giftId, tipo, modo: 'presente' };
    } else {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }

      await userRef.set(
        {
          card: cardData,
          cardStatus: 'pending_activation',
        },
        { merge: true }
      );

      const activationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/ativar?token=${activationToken}&uid=${uid}`;
      await resend.emails.send({
        from: 'MIMO <cartoes@mimo.com>',
        to: email,
        subject: `Ative seu cartão MIMO`,
        react: CardActivationEmail({
          recipientName: nome,
          isGift: false,
          activationLink,
        }),
      });

      resultData = { success: true, tipo, modo: 'proprio' };
    }

    return NextResponse.json(resultData);

  } catch (error) {
    console.error('Erro na API de solicitação de cartão:', error);

    const message =
      error instanceof Error ? error.message : 'Falha ao processar solicitação';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
