// src/app/api/create_preference/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, amount, email } = await req.json();

    // ⚠️ amount deve ser number, não string
    const transactionAmount = typeof amount === 'string' 
      ? parseFloat(amount) 
      : amount;

    const preference = {
      items: [
        {
          id: '123', // opcional
          title: title || 'Doação',
          description: 'Pagamento via site',
          picture_url: '', // opcional
          category_id: 'services', // opcional
          quantity: 1,
          currency_id: 'BRL',
          unit_price: transactionAmount, 
        },
      ],
      payer: {
        email: email || 'cliente@teste.com',
      },
      // Opcional, mas recomendado
back_urls: {
  success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
  pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pix-pendente`,
  failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/falha`,
},
      auto_return: 'approved' as const,
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Erro ao criar preference:', data);
      return Response.json({ error: 'Falha ao criar preference' }, { status: res.status });
    }

    console.log('✅ Preference criada:', data.id);
    return Response.json({ id: data.id });
  } catch (error) {
    console.error('💥 Erro no create_preference:', error);
    return Response.json({ error: 'Erro interno' }, { status: 500 });
  }
}