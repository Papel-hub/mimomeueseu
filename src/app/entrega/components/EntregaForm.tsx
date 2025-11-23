'use client';

import { useState } from 'react';
import EntregaTypeSection from './EntregaTypeSection';
import DeliveryCalendar from './DeliveryCalendar';
import DeliveryMethodSection from './DeliveryMethodSection';

type DigitalMethod = 'whatsapp' | 'email';
type FisicaMethod = 'correios' | 'transportadora' | 'ponto' | 'delivery' | 'uber' | 'taxi';
type MaoAmigaMethod = 'cupidos' | 'anfitrioes' | 'influencers' | 'parceiros';

export default function EntregaForm() {
  const [tipoEntrega, setTipoEntrega] = useState<'digital' | 'fisica' | 'ambos'>('digital');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [digitalMethod, setDigitalMethod] = useState<DigitalMethod | null>(null);
  const [fisicaMethod, setFisicaMethod] = useState<FisicaMethod | null>(null);
  const [maoAmigaMethod, setMaoAmigaMethod] = useState<MaoAmigaMethod | null>(null);

  // Funções de seleção com regras claras
  const handleDigitalSelect = (value: DigitalMethod) => {
    // Ao escolher digital, limpa Mão Amiga (mas mantém físico se estiver em "ambos")
    setDigitalMethod(value);
    setMaoAmigaMethod(null);
  };

  const handleFisicaSelect = (value: FisicaMethod) => {
    // Ao escolher físico, limpa Mão Amiga (mas mantém digital se estiver em "ambos")
    setFisicaMethod(value);
    setMaoAmigaMethod(null);
  };

  const handleMaoAmigaSelect = (value: MaoAmigaMethod) => {
    // Ao escolher Mão Amiga, limpa tudo de Digital e Física
    setMaoAmigaMethod(value);
    setDigitalMethod(null);
    setFisicaMethod(null);
  };

  // Validação para o botão "Continuar"
  const canContinue = () => {
    if (maoAmigaMethod) {
      // Mão Amiga é standalone
      return true;
    }

    if (tipoEntrega === 'digital') {
      return digitalMethod !== null;
    }

    if (tipoEntrega === 'fisica') {
      return fisicaMethod !== null;
    }

    if (tipoEntrega === 'ambos') {
      return digitalMethod !== null && fisicaMethod !== null;
    }

    return false;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md space-y-6 max-w-xl mx-auto p-6 border border-gray-100">
      <EntregaTypeSection tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega} />
      <DeliveryCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      {(tipoEntrega === 'digital' || tipoEntrega === 'ambos') && (
        <DeliveryMethodSection<DigitalMethod>
          title="Entregas Digitais"
          options={[
            { id: 'whatsapp', label: 'WhatsApp' },
            { id: 'email', label: 'E-mail' },
          ]}
          selected={digitalMethod}
          onSelect={handleDigitalSelect}
        />
      )}

      {(tipoEntrega === 'fisica' || tipoEntrega === 'ambos') && (
        <DeliveryMethodSection<FisicaMethod>
          title="Entregas Físicas"
          options={[
            { id: 'correios', label: 'Correios' },
            { id: 'transportadora', label: 'Transportadoras/Cliente' },
            { id: 'ponto', label: 'Ponto de Recolha' },
            { id: 'delivery', label: 'Delivery' },
            { id: 'uber', label: 'Uber' },
            { id: 'taxi', label: 'Táxi' },
          ]}
          selected={fisicaMethod}
          onSelect={handleFisicaSelect}
        />
      )}

      <DeliveryMethodSection<MaoAmigaMethod>
        title="Entregas Mão Amiga"
        subtitle="(Reservado para parceiros)"
        options={[
          { id: 'cupidos', label: 'Cupidos' },
          { id: 'anfitrioes', label: 'Anfitriões' },
          { id: 'influencers', label: 'Influencers' },
          { id: 'parceiros', label: 'Parceiros' },
        ]}
        selected={maoAmigaMethod}
        onSelect={handleMaoAmigaSelect}
      />

      <div className="space-y-3">
        <button
          type="button"
          disabled={!canContinue()}
          className="w-full flex items-center justify-center gap-2 font-semibold p-3 bg-red-900 text-white rounded-full hover:bg-red-800 transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Continuar
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 font-semibold p-3 border border-red-900 text-red-900 rounded-full hover:bg-red-50 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}