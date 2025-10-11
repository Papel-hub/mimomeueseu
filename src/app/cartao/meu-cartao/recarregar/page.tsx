// app/meu-cartao/recarregar/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const valoresPreDefinidos = [50, 100, 150, 200, 300];

export default function RecarregarSaldoPage() {
  const router = useRouter();
  const [valorPersonalizado, setValorPersonalizado] = useState<string>('');
  const [valorSelecionado, setValorSelecionado] = useState<number | null>(100); // valor padrão
type FormaPagamento = 'pix' | 'cartao' | 'boleto';
const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');

  const [estaProcessando, setEstaProcessando] = useState(false);

  const valorFinal = valorSelecionado || parseFloat(valorPersonalizado) || 0;

  const handleValorPreDefinido = (valor: number) => {
    setValorSelecionado(valor);
    setValorPersonalizado('');
  };

  const handleValorPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Aceita apenas números e um ponto ou vírgula
    if (/^\d*[,]?\d*$/.test(valor) || valor === '') {
      setValorPersonalizado(valor);
      setValorSelecionado(null);
    }
  };

  const handleConfirmar = () => {
    if (valorFinal < 10) {
      alert('O valor mínimo para recarga é R$ 10,00.');
      return;
    }

    setEstaProcessando(true);

    // 🟢 Simula processamento
    setTimeout(() => {
      // Em produção: chamar API de pagamento aqui
      // Ex: const res = await fetch('/api/pagamento/recarga', { method: 'POST', body: JSON.stringify(...) });

      // Simula sucesso
      alert(`Recarga de R$ ${valorFinal.toFixed(2)} iniciada via ${formaPagamento.toUpperCase()}!`);
      router.push('/meu-cartao');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Recarregar Saldo</h1>
          <p className="text-gray-600 mt-2">
            Adicione saldo ao seu Cartão Mimo para comprar online, em lojas ou presentear.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          {/* Valores pré-definidos */}
          <h2 className="font-semibold text-gray-800 mb-3">Valores sugeridos</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {valoresPreDefinidos.map((valor) => (
              <button
                key={valor}
                onClick={() => handleValorPreDefinido(valor)}
                className={`py-3 rounded-lg font-medium transition-colors ${
                  valorSelecionado === valor
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                R$ {valor},00
              </button>
            ))}
          </div>

          {/* Valor personalizado */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Outro valor (mínimo R$ 10,00)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={valorPersonalizado}
                onChange={handleValorPersonalizado}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Forma de pagamento */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Forma de pagamento</h2>
            <div className="space-y-3">
             {[
  { id: 'pix', label: 'PIX (instantâneo)', icon: '📱' },
  { id: 'cartao', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'boleto', label: 'Boleto Bancário', icon: '📄' },
].map((opcao) => (
  <label
    key={opcao.id}
    className={`flex items-center p-4 rounded-lg border cursor-pointer ${
      formaPagamento === opcao.id
        ? 'border-rose-500 bg-rose-50'
        : 'border-gray-200 hover:bg-gray-50'
    }`}
  >
    <input
      type="radio"
      name="pagamento"
      checked={formaPagamento === opcao.id}
      onChange={() => setFormaPagamento(opcao.id as FormaPagamento)} // ou só setFormaPagamento(opcao.id)
      className="sr-only"
    />
    <span className="text-xl mr-3">{opcao.icon}</span>
    <span className="font-medium text-gray-800">{opcao.label}</span>
  </label>
))}

            </div>
          </div>

          {/* Resumo */}
          <div className="bg-rose-50 rounded-lg p-4 mb-6 border border-rose-100">
            <div className="flex justify-between text-gray-700">
              <span>Valor da recarga:</span>
              <span className="font-bold">R$ {valorFinal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mt-1">
              <span>Forma:</span>
              <span className="font-medium">
                {formaPagamento === 'pix' ? 'PIX' : formaPagamento === 'cartao' ? 'Cartão' : 'Boleto'}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleConfirmar}
              disabled={valorFinal < 10 || estaProcessando}
              className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
                valorFinal >= 10 && !estaProcessando
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {estaProcessando ? 'Processando...' : `Recarregar R$ ${valorFinal.toFixed(2)}`}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 px-4 text-gray-700 font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm">
          Seu saldo será atualizado assim que o pagamento for confirmado.
        </p>
      </div>
    </div>
  );
}
