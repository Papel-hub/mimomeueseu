// components/Card.tsx
'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import QRCode from 'react-qr-code';
import ImageCard from '@/components/Image';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-rose-600 rounded-full border-t-transparent"></div>
  </div>
);

export default function CardPage() {
  const router = useRouter();
  const { data: cartaoData, error, isLoading } = useSWR('/api/user/cartao', fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Erro ao carregar o cartão.</div>;
  if (!cartaoData) return null;

  const { id, name, saldo } = cartaoData;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4">
      {/* Card visual */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 mb-8">
        <div className="card-svg mb-4">
          {/* Aqui você pode colar seu SVG completo */}
          <svg width="240" height="155">
            <rect width="240" height="155" fill="#6C1416" />
            <ImageCard/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <p className="text-gray-700 mb-4">Saldo: ${saldo?.toFixed(2)}</p>

        <div className="flex justify-center">
          <QRCode value={`MIMO:${id}`} size={128} />
        </div>
      </div>

      <button
        className="bg-rose-600 text-white px-6 py-3 rounded-lg shadow hover:bg-rose-700 transition"
        onClick={() => router.push('/')}
      >
        Voltar
      </button>
    </div>
  );
}
