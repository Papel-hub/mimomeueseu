// components/ApprovalCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface ApprovalCardProps {
  id: string;
  customerName: string;
  productName: string;
  amount: string;
  categoria: string;
  date: string;
  imageUrl: string;
}

export default function ApprovalCard({
  id,
  customerName,
  productName,
  amount,
  date,
  imageUrl,
  categoria,
}: ApprovalCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg transition-all duration-200">
      {/* Cabeçalho */}
      <div className="flex items-start border-b border-gray-200 pb-3 gap-4">
        <div className="relative w-30 h-30 rounded-lg overflow-hidden border-2 border-gray-100">
          <Image
            src={imageUrl}
            alt={customerName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-base">
            {productName} - <span className="font-semibold  text-gray-900">{amount}</span>
          </h3>
          <p className="text-sm text-gray-700 truncate">
            Categoria: {categoria}
          </p>
          <p className="text-xs text-gray-500">Enviado em: {date}</p>
          <p className="text-xs font-medium text-gray-800 mt-1"> 
            Cliente: <span className="text-red-900 font-medium">{customerName}</span>
          </p>
        </div>
      </div>
      {/* Linha inferior */}
        <div className="mt-4 flex justify-between items-center border-b border-gray-200 pb-3">
            <p>Anexos:</p>
        <Link
        href="/detalhes"
        className="flex items-center gap-1 text-sm text-grey-800 hover:text-red-800 font-medium transition-colors"
        >
        Ver detalhes
        </Link>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            className="flex items-center justify-center border border-red-900 w-full gap-2 p-3 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 transition"
            aria-label={`Aprovar pedido ${id}`}
          >
            Aprovar
          </button>
          <button
            className="flex items-center border border-red-900 justify-center w-full gap-2 p-3 text-red-900 bg-white font-semibold rounded-full hover:bg-red-100 transition"
            aria-label={`Reprovar pedido ${id}`}
          >
            Reprovar
          </button>
        </div>
    </div>
  );
}
