// app/api/user/cartao/route.ts
import { NextRequest } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { status: 404 });
    }

    const userData = userDoc.data();
    const card = userData?.card;

    if (!card) {
      return new Response(JSON.stringify({ hasCartao: false }), { status: 200 });
    }

    // Máscara para o número do cartão: MIMO****1234
    const visibleLast4 = card.cardNumber?.slice(-4) || '0000';
    const maskedCardNumber = `MIMO****${visibleLast4}`;

    return new Response(
      JSON.stringify({
        hasCartao: true,
        id: uid,
        nome: userData.name || 'Usuário',
        nivel: card.tipo === 'virtual' ? 'Prata' : 'Ouro', // ajuste conforme sua lógica
        cardNumber: maskedCardNumber,
        transacoes: card.transacoes || [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
    return new Response(JSON.stringify({ error: 'Erro interno' }), { status: 500 });
  }
}