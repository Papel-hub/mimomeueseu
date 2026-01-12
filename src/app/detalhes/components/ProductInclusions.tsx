import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

interface ProductInclusionsProps {
  id: string;
  items: string[];
  nutritionalInfo: {
    calories: string;
    origin: string;
    certification: string;
  };
}

export default function ProductInclusions({ id, items, nutritionalInfo }: ProductInclusionsProps) {
  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-slide-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
        Itens Inclusos
      </h2>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            {item}
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Informações Adicionais</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• {nutritionalInfo.calories}</p>
          <p>• {nutritionalInfo.origin}</p>
          <p>• {nutritionalInfo.certification}</p>
        </div>
      </div>

      <Link href={`/personalizar/${id}`} className="mt-8 block">
        <button className="w-full flex items-center justify-center gap-3 bg-red-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-red-800 transition-all shadow-md active:scale-95">
          <FaEdit />
          Personalizar esta Cesta
        </button>
      </Link>
    </section>
  );
}