'use client';

import { useState } from 'react';

type EntregaFisicaSectionProps = {
  onSelect: (methods: string[]) => void;
};

const PHYSICAL_METHODS = [
  { key: 'correios', label: 'Correios' },
  { key: 'transportadora', label: 'Transportadoras / Cliente' },
  { key: 'pontos_recolha', label: 'Pontos de Recolha' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'uber', label: 'Uber' },
  { key: 'taxi', label: 'Táxi' },
];

export default function EntregaFisicaSection({ onSelect }: EntregaFisicaSectionProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (method: string) => {
    const newSelected = selected.includes(method)
      ? selected.filter((m) => m !== method)
      : [...selected, method];
    setSelected(newSelected);
    onSelect(newSelected);
  };

  return (
    <div className="border rounded-xl border-gray-200 bg-white p-5">
      <h3 className="font-semibold text-gray-800 mb-3">📦 Entregas Físicas</h3>
      <div className="space-y-2">
        {PHYSICAL_METHODS.map(({ key, label }) => (
          <label key={key} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
              className="mr-3 accent-red-600"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}