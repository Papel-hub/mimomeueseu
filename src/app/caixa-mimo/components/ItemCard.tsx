import Image from 'next/image';

type Item = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: 'produto' | 'servico';
};

export default function ItemCard({ 
  item, 
  onAddToCart 
}: { 
  item: Item; 
  onAddToCart: (item: Item) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={item.imagem} 
          alt={item.nome}
          width={100}
          height={32}
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
          {item.categoria === 'produto' ? 'Produto' : 'Serviço'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.nome}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.descricao}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-red-800">
            R$ {item.preco.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-red-900 hover:bg-red-800 text-white w-10 h-10 rounded-full transition-colors duration-200"
            aria-label={`Adicionar ${item.nome} ao carrinho`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}