'use client';

import { useState } from 'react';

type EntregaMaoAmigaSectionProps = {
  onSelect: (methods: string[]) => void;
  isVisible: boolean;
};

const MAO_AMIGA_METHODS = [
  { key: 'cupidos', label: 'Cupidos' },
  { key: 'anfitrioes', label: 'Anfitriões' },
  { key: 'influencers', label: 'Influencers' },
  { key: 'parceiros', label: 'Parceiros' },
];

export default function EntregaMaoAmigaSection({
  onSelect,
  isVisible,
}: EntregaMaoAmigaSectionProps) {
  const [selected, setSelected] = useState<string[]>([]);

  if (!isVisible) return null;

  const toggle = (method: string) => {
    const newSelected = selected.includes(method)
      ? selected.filter((m) => m !== method)
      : [...selected, method];
    setSelected(newSelected);
    onSelect(newSelected);
  };

  return (
    <div className="border rounded-xl border-red-200 bg-red-50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-700 font-semibold">🤝 Entregas Mão Amiga</span>
        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
          Parceiros
        </span>
      </div>
      <p className="text-sm text-red-600 mb-3">
        Disponível apenas para parceiros cadastrados.
      </p>
      <div className="space-y-2">
        {MAO_AMIGA_METHODS.map(({ key, label }) => (
          <label key={key} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={() => toggle(key)}
              className="mr-3 accent-red-600"
            />
            <span className="text-red-800">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}