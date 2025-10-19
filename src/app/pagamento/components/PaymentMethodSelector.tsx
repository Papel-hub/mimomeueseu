// app/pagamento/components/PaymentMethodSelector.tsx
import { useRef } from 'react';

type PaymentMethod = 'pix' | 'cartaomimo' | 'cartao' | 'boleto' | '';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="max-w-md mx-auto mb-3">
      <div className="relative">
        <select
          id="metodo-pagamento"
          ref={selectRef}
          value={value}
          onChange={(e) => onChange(e.target.value as PaymentMethod)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="">Selecione o tipo</option>
          <option value="pix">PIX</option>
          <option value="cartaomimo">Cartão Mimo</option>
          <option value="cartao">Cartão de Crédito</option>
          <option value="boleto">Boleto</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-rose-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}