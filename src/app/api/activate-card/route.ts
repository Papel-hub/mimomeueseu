// app/api/activate-card/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { generateVirtualCardNumber } from '@/lib/generateCardNumber';

export async function POST(req: NextRequest) {
  try {
    // 1. Verifica token de autenticação
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 2. Busca usuário no Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // 3. Verifica se já tem cartão ativo
    if (userData?.card?.status === 'active') {
      return NextResponse.json({ success: true, card: userData.card });
    }

    // 4. Ativa novo cartão digital
    const cardNumber = generateVirtualCardNumber();
    const cardData = {
      number: cardNumber,
      status: 'active',
      type: 'digital',
      balance: 0,
      createdAt: new Date().toISOString(),
    };

    // 5. Atualiza documento do usuário
    await db.collection('users').doc(uid).update({
      card: cardData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, card: cardData });

  } catch (error) {
    console.error('Erro ao ativar cartão:', error);
    return NextResponse.json({ error: 'Falha ao ativar cartão' }, { status: 500 });
  }
}