'use client';

import { useRouter } from 'next/navigation';

export interface Transacao {
  id: string;
  descricao: string;
  data: string;
  tipo: 'recarga' | 'compra';
  valor: number;
}

export default function TransacoesSection({ transacoes }: { transacoes: Transacao[] }) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(valor));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Transações</h2>
      <div className="space-y-4">
        {transacoes && transacoes.length > 0 ? (
          transacoes.map((t) => (
            <div
              key={t.id}
              className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  {t.tipo === 'recarga' ? '💰' : '🛒'} {t.descricao}
                </p>
                <p className="text-xs text-gray-500">{formatDate(t.data)}</p>
              </div>
              <span
                className={`font-bold ${t.tipo === 'recarga' ? 'text-green-600' : 'text-red-600'}`}
              >
                {t.tipo === 'recarga' ? '+' : '-'} {formatCurrency(t.valor)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Nenhuma transação encontrada.</p>
        )}
      </div>
      <button
        onClick={() => router.push('/transacoes')}
        className="mt-4 text-rose-600 hover:underline text-sm font-medium"
      >
        Ver todo o histórico
      </button>
    </div>
  );
}
