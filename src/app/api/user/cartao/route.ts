// app/api/user/cartao/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Simulação rápida, sem acessar banco
  return NextResponse.json({ hasCartao: true });
}
