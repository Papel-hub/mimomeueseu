"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const router = useRouter();
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  if (cartCount === 0) {
    return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione cestas para continuar sua compra.</p>
            <button
              onClick={() => router.push("/cestas")}
              className="bg-red-900 text-white px-6 py-3 rounded-full font-medium shadow hover:bg-red-800 transition"
            >
              Ver cestas
            </button>
          </div>
        </div>
        </main>
      <Footer />
    </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
    <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Seu Carrinho
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-red-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
              />
            </svg>
          </h1>
        </div>

        {/* Lista de Itens */}
        <section className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-5 border-b border-gray-100 last:border-b-0"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
<Image
  src={
    Array.isArray(item.image)
      ? item.image[0] // pega a primeira imagem
      : item.image || '/images/p1.png'
  }
  alt={item.title || 'Produto'}
  fill
  className="object-cover rounded-lg"
/>

              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{formatPrice(item.price ?? 0)}</p>
              </div>

              {/* Controle de quantidade */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    item.quantity <= 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold hover:bg-gray-300 transition"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              {/* Preço total do item */}
              <div className="font-bold text-red-900 min-w-[80px] text-right">
                {formatPrice(item.price ?? 0 * item.quantity)}
              </div>

              {/* Botão remover */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                aria-label={`Remover ${item.title} do carrinho`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </section>

        {/* Resumo e Botões */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"></div>
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total:</span>
              <span className="text-red-900">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Frete e impostos calculados no checkout.
            </p>

<button
  onClick={() => router.push(`/pagamento?amount=${encodeURIComponent(cartTotal)}`)}
  className="w-full bg-red-900 text-white py-3 rounded-full font-bold hover:bg-red-800 transition shadow-md"
>
  Finalizar Compra
</button>



            <button
              onClick={() => router.push("/cestas")}
              className="w-full py-3 text-gray-700 font-medium hover:text-red-900 transition"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </main>
      <Footer />
    </div>
  );
}