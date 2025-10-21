// app/api/solicitar-cartao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';
import { CardActivationEmail } from '@/emails/CardActivationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCardNumber(): string {
  const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
  return `MIMO${digits}`;
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Gera um token de ativação seguro (você pode salvar no Firestore com expiração)
function generateActivationToken() {
  return Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('');
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 Autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const senderEmail = decodedToken.email; // quem está logado

    const body = await req.json();
    const { tipo, modo, nome, email, mensagem, endereco } = body;

    if (!tipo || !modo || !nome || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (tipo === 'fisico' && (!endereco || !endereco.cep || endereco.cep.length !== 8)) {
      return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
    }

    // 🔢 Geração segura
    const cardNumber = generateCardNumber();
    const pin = generatePin();
    const activationToken = generateActivationToken();

    const cardData = {
      cardNumber,
      pin,
      tipo,
      modo,
      nome,
      email,
      mensagem: modo === 'presente' ? mensagem || null : null,
      ...(tipo === 'fisico' && { endereco }),
      status: 'pending_activation',
      activationToken, // ← salva token para validação depois
      activationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      createdAt: new Date().toISOString(),
    };

    let resultData;

    if (modo === 'presente') {
      // 🎁 Presente
      const giftId = db.collection('gifts').doc().id;
      const giftRef = db.collection('gifts').doc(giftId);
      await giftRef.set({
        ...cardData,
        giftId,
        senderUid: uid,
        senderEmail,
      });

      // 📩 Envia e-mail para o PRESENTEADO
      const activationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/ativar?token=${activationToken}&giftId=${giftId}`;
      await resend.emails.send({
        from: 'MIMO <cartoes@mimo.com>',
        to: email,
        subject: `Você recebeu um cartão MIMO!`,
        react: CardActivationEmail({
          recipientName: nome,
          isGift: true,
          activationLink,
          senderName: decodedToken.name || 'Alguém',
          message: mensagem || undefined,
        }),
      });

      resultData = { success: true, giftId, tipo, modo: 'presente' };
    } else {
      // 👤 Próprio
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

      // 📩 Envia e-mail para o PRÓPRIO USUÁRIO
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
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Falha ao processar solicitação' }, { status: 500 });
  }
}