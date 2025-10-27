// app/api/solicitar-cartao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';
import { CardActivationEmail } from '@/emails/CardActivationEmail';
import { createHash } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Gera número do cartão no formato MIMO + 13 dígitos
function generateCardNumber(): string {
  const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
  return `MIMO${digits}`;
}

// Gera PIN de 4 dígitos (em texto) — armazenaremos só o hash
function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4 dígitos
}

function hashPin(pin: string): string {
  return createHash('sha256').update(pin).digest('hex');
}

// Validade: 2 anos a partir do mês atual, formato "MM/AA" (ex: "10/27")
function generateExpiry(): string {
  const now = new Date();
  const expiryYear = now.getFullYear() + 2; // válido por 2 anos
  const expiryMonth = String(now.getMonth() + 1).padStart(2, '0'); // mês atual
  return `${expiryMonth}/${String(expiryYear).slice(2)}`; // ex: "10/27"
}

// Gera CVV de 3 dígitos (⚠️ só para dev; se for produção, consider securizar)
function generateCVV(): string {
  return Math.floor(100 + Math.random() * 900).toString(); // 3 dígitos
}

function generateActivationToken(): string {
  return Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('');
}

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    const senderEmail = decodedToken.email;
    const senderName = decodedToken.name || 'Usuário';

    const body = await req.json();
    const { tipo, modo, nome, email, mensagem, endereco } = body || {};

    // Validação básica
    if (!tipo || !modo || !nome || !email) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (tipo === 'fisico' && (!endereco || !endereco.cep || endereco.cep.length !== 8)) {
      return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
    }

    // Geração dos dados do cartão
    const cardNumber = generateCardNumber();
    const pin = generatePin();
    const validade = generateExpiry();
    const cvv = generateCVV();
    const activationToken = generateActivationToken();

    // Estrutura que será salva no Firestore.
    // NOTE: uso `number` para ser consistente com o documento existente.
    const cardData = {
      number: cardNumber,         // <-- campo "number" no Firestore
      pinHash: hashPin(pin),      // armazenamos o hash do PIN
      validade,                   // ex: "10/27"
      cvv,                        // ex: "123"
      tipo,
      modo,
      nome,
      email,
      mensagem: modo === 'presente' ? mensagem || null : null,
      ...(tipo === 'fisico' && { endereco }),
      status: 'active', // estado do cartão em serviço (se preferir usar cardStatus, podemos adicionar também)
      cardStatus: 'pending_activation', // campo extra se você usa ambos
      activationToken,
      activationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias para ativar
      createdAt: new Date().toISOString(),
    };

    let resultData;

    if (modo === 'presente') {
      // Cartão presente: salva em coleção gifts
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

      // Opcional: enviar o PIN claro ao remetente ou ao destinatário via e-mail (se desejar).
      // No momento não envio o PIN por email por segurança.

      resultData = { success: true, giftId, tipo, modo: 'presente' };
    } else {
      // Cartão para o próprio usuário: atualiza doc do user
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

    // Se quiser retornar o PIN gerado para uso temporário (ex.: mostrar na UI após criação),
    // pode retornar `pin` aqui — mas isso expõe o PIN no corpo da resposta. Optei por não retornar.
    // Se quiser, posso adicionar um campo `tempPin` ao resultData somente para retorno.

    return NextResponse.json(resultData);
  } catch (error) {
    console.error('Erro na API de solicitação de cartão:', error);
    return NextResponse.json({ error: 'Falha ao processar solicitação' }, { status: 500 });
  }
}
