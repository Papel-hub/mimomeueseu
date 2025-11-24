import Link from 'next/link';
import Image from 'next/image';

export interface ProdutosCardProps {
  id: string;
  title: string;
  price?: number;
  rating?: number; // ✅ adicione esta linha
  image: string;
  showPrice?: boolean;
  showViewAdd?: boolean;
}



const ProdutosCard = ({
  id,
  title,
  price,
  image,
  showPrice = true,
  showViewAdd = false,
}: ProdutosCardProps) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
    <Link href={`/detalhes/${id}`} className="block">

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
    {showViewAdd && (
      <div className="px-4 pb-4">
        <Link
          href={`/cestas/${id}`}
          className="block w-full text-center bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-full font-medium transition-colors"
        >
          Adicionar a Cesta
        </Link>
      </div>
    )}
  </div>
);

export default ProdutosCard;