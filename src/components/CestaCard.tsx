import Link from 'next/link';
import Image from 'next/image';

export interface CestasCardProps {
  id: string;
  title: string;
  price?: number;
  rating?: number; // ✅ adicione esta linha
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
  bestseller, // ✅ desestruturado
  showPrice = true,
  showViewDetails = false,
}: CestasCardProps) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <Link href={`/cestas/${id}`} className="block">
      {/* Badge "Mais Vendido" */}
      {bestseller && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-tr-2xl rounded-bl-2xl z-10">
          MAIS VENDIDO
        </div>
      )}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt={title || 'Produto sem título'}
          width={300}
          height={200}
          className="object-cover w-full h-full transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {title}
        </h3>
        {showPrice && price !== undefined && (
          <p className="text-xl font-bold text-black mt-2">
            R$ {price.toFixed(2)}
          </p>
        )}
      </div>
    </Link>

    {/* Botão "Ver detalhes" */}
    {showViewDetails && (
      <div className="px-4 pb-4">
        <Link
          href={`/cestas/${id}`}
          className="block w-full text-center bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-full font-medium transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    )}
  </div>
);

export default CestasCard;