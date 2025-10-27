'use client';

import { useState } from 'react';

type EntregaDigitalSectionProps = {
  onSelect: (methods: string[]) => void;
};

export default function EntregaDigitalSection({ onSelect }: EntregaDigitalSectionProps) {
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
      <h3 className="font-semibold text-gray-800 mb-3">📱 Entregas Digitais</h3>
      <div className="space-y-2">
        {['whatsapp', 'email'].map((method) => (
          <label key={method} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(method)}
              onChange={() => toggle(method)}
              className="mr-3 accent-red-600"
            />
            <span className="text-gray-700 capitalize">
              {method === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}