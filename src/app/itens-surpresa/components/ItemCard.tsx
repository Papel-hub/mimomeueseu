// components/ItemCard.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ItemCardProps = {
  item: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
  };
  cestaId: string;
};

export default function ItemCard({ item, cestaId }: ItemCardProps) {
  const router = useRouter();

  const handleSelect = () => {
    // Salvar escolha no localStorage ou Firestore
    localStorage.setItem(`surpresa_${cestaId}`, JSON.stringify(item));
    router.push(`/cestas/${cestaId}`); // Voltar para a cesta
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
      <div className="h-48 w-full relative">
        <Image
          src={item.imagem || '/images/placeholder.svg'}
          alt={item.nome}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{item.nome}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.descricao}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="font-semibold text-red-900">R$ {item.preco.toFixed(2)}</span>
          <button
            onClick={handleSelect}
            className="text-sm bg-red-900 text-white px-3 py-1 rounded-full hover:bg-red-800 transition"
          >
            Selecionar
          </button>
        </div>
      </div>
    </div>
  );
}