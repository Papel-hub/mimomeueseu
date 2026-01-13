import Link from 'next/link';
import Image from 'next/image';
import { Eye, Plus } from 'lucide-react'; 


export interface CestasCardProps {
  id: string;
  title: string;
  price?: number;
  rating?: number;
  image: string;
  bestseller?: boolean;
  showPrice?: boolean;
  showViewDetails?: boolean;
}



const CestasCard = ({
  id,
  title,
  price,
  image,
  bestseller, 
  showPrice = true,
  showViewDetails = true,
}: CestasCardProps) => (
  <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <Link href={`/detalhes/${id}`} className="block">
      {/* Badge "Mais Vendido" */}
      {bestseller && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-2xl z-10">
          MAIS VENDIDO
        </div>
      )}
      <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt={title || 'Produto sem título'}
          width={300}
          height={192}
          className="object-cover w-full h-full rounded-xl transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {title}
        </h3>
        {showPrice && price !== undefined && (
          <p className="text-lg font-bold text-black">
            R$ {price.toFixed(2)}
          </p>
        )}
      </div>
    </Link>

    {/* Botão "Ver detalhes" */}
    {showViewDetails && (
      <div className="px-4 pb-4">
        <Link
          href={`/detalhes/${id}`}
            className="w-full flex items-center justify-center gap-2 bg-red-900 text-white font-medium py-2.5 px-4 rounded-full hover:bg-red-800 transition focus:outline-none "
            aria-label="Visualizar detalhes"  
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Detalhes
        </Link>
      </div>
    )}
  </div>
);

export default CestasCard;