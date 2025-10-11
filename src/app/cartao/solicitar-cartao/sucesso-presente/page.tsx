// app/solicitar-cartao/sucesso-presente/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SucessoPresentePage() {
  const router = useRouter();
  const [dados, setDados] = useState<{
    nome: string;
    email: string;
    tipoEntrega: 'fisico' | 'digital';
    mensagem: string;
  } | null>(null);

  useEffect(() => {
    // Recupera os dados salvos no localStorage
    const saved = localStorage.getItem('mimo_dados_cartao');
    if (!saved) {
      router.push('/solicitar-cartao');
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setDados({
        nome: parsed.nome,
        email: parsed.email,
        tipoEntrega: parsed.tipoEntrega,
        mensagem: parsed.mensagem,
      });
} catch (e: unknown) {
  console.error('Erro ao carregar dados do cartão:', e);
  router.push('/solicitar-cartao');
}
  }, [router]);

  if (!dados) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-rose-600 rounded-full"></div>
      </div>
    );
  }

  const isFisico = dados.tipoEntrega === 'fisico';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Ícone de sucesso */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 mb-6">
          <span className="text-4xl">🎁</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Presente enviado com carinho!
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 text-left">
          <p className="text-gray-700 mb-4">
            Seu presente para <span className="font-semibold text-rose-700">{dados.nome}</span> foi
            {isFisico ? ' agendado para entrega em casa' : ' enviado digitalmente'}.
          </p>

          <div className="bg-rose-50 rounded-lg p-4 mb-4 border border-rose-100">
            <p className="italic text-gray-700">“{dados.mensagem}”</p>
          </div>

          <p className="text-sm text-gray-500">
            {isFisico
              ? 'A embalagem especial será entregue nos próximos dias.'
              : 'O presenteado receberá um link por e-mail para ativar seu cartão.'}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Enquanto isso, que tal cuidar de você também?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/solicitar-cartao"
              className="px-6 py-3 bg-white text-rose-700 font-medium rounded-full border border-rose-300 hover:bg-rose-50 transition-colors"
            >
              Presentear outra pessoa
            </Link>
            <Link
              href="/meu-cartao"
              className="px-6 py-3 bg-rose-600 text-white font-medium rounded-full hover:bg-rose-700 transition-colors"
            >
              Criar meu próprio cartão
            </Link>
          </div>
        </div>

        <div className="mt-10 text-gray-500 text-sm">
          <p>
            Qualquer dúvida, nossa equipe de carinho está em{' '}
            <Link href="mailto:oi@mimomeuese.com.br" className="text-rose-600 hover:underline">
              oi@mimomeuese.com.br
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}