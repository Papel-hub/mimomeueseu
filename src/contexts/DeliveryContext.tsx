'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type DigitalMethod = 'whatsapp' | 'email';
type FisicaMethod = 'correios' | 'transportadora' | 'ponto' | 'delivery' | 'uber' | 'taxi';
type MaoAmigaMethod = 'cupidos' | 'anfitrioes' | 'influencers' | 'parceiros';

export type DeliveryData = {
  tipoEntrega: 'digital' | 'fisica' | 'ambos';
  selectedDate: Date | null;
  digitalMethod: DigitalMethod | null;
  fisicaMethod: FisicaMethod | null;
  maoAmigaMethod: MaoAmigaMethod | null;
};

const DeliveryContext = createContext<{
  deliveryData: DeliveryData;
  setDeliveryData: (data: DeliveryData) => void;
}>({
  deliveryData: {
    tipoEntrega: 'digital',
    selectedDate: null,
    digitalMethod: null,
    fisicaMethod: null,
    maoAmigaMethod: null,
  },
  setDeliveryData: () => {},
});

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    tipoEntrega: 'digital',
    selectedDate: null,
    digitalMethod: null,
    fisicaMethod: null,
    maoAmigaMethod: null,
  });

  return (
    <DeliveryContext.Provider value={{ deliveryData, setDeliveryData }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export const useDelivery = () => useContext(DeliveryContext);