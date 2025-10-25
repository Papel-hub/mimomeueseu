'use client';

import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { Cesta } from '@/types/cesta';

type CestaItensInfoProps = {
  cesta: Cesta;
};

export default function CestaItensInfo({ cesta }: CestaItensInfoProps) {
  const router = useRouter();

  const handlePersonalizar = () => {
    router.push(`/personalizar/${cesta.id}`);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-lg text-gray-800 mb-3">Itens inclusos:</h2>
      <ul className="space-y-2">
        {cesta.items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h3 className="font-medium text-green-800 mt-4 mb-2">Informações adicionais</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>• {cesta.nutritionalInfo.calories}</li>
        <li>• {cesta.nutritionalInfo.origin}</li>
        <li>• {cesta.nutritionalInfo.certification}</li>
      </ul>

      <div className="mt-6">
        <button
          onClick={handlePersonalizar}
          className="w-full flex items-center justify-center border border-red-900 bg-red-900 text-white font-medium py-3 px-4 rounded-full transition hover:bg-red-800"
        >
          <FaEdit className="h-5 w-5 mr-2" aria-hidden="true" />
          Personalizar cesta
        </button>
      </div>
    </div>
  );
}