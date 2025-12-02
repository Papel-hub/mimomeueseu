import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaBox } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Item } from '@/types/item';

export default function FloatingCart({ 
  cartItems,
  onRemoveItem,
  onCheckout
}: { 
  cartItems: Item[]; 
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}) {

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const total = cartItems.reduce((sum, item) => sum + item.preco, 0);

  const categoriaLabel = {
    produto: 'Produto',
    servico: 'Serviço',
    experiencia: 'Experiência'
  };

  // 🔥 Salva no localStorage e retorna para a página anterior
  const handleFinish = () => {
    if (cartItems.length === 0) return;

    localStorage.setItem('carrinho_surpresa', JSON.stringify(cartItems));

    router.back();

    onCheckout();
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-900 text-white p-4 rounded-full shadow-lg hover:bg-red-800 transition-all duration-300 z-50 animate-float"
        aria-label="Ver carrinho"
      >
        <div className="relative">
          <FontAwesomeIcon icon={faBox} size="lg" />

          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {cartItems.length}
            </span>
          )}
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/15 bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full max-w-md max-h-[80vh] rounded-t-xl shadow-lg overflow-hidden m-auto">
            
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Itens Surpresa</h2>

              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum item adicionado</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Image
                        src={item.imagem}
                        alt={item.nome}
                        className="object-cover rounded-lg"
                        width={60}
                        height={60}
                      />

                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800">{item.nome}</h3>
                        <p className="text-sm text-gray-600">
                          {categoriaLabel[item.categoria]}
                        </p>
                        <p className="font-bold text-red-800">R$ {item.preco.toFixed(2)}</p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rodapé */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-xl text-red-800">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full flex items-center gap-2 justify-center border border-red-900 bg-red-900 text-white font-medium py-3 px-4 rounded-full transition hover:bg-red-800"
                >
                  Fechar caixa <FaBox className="mr-2" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
