'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import CestasCard from '@/components/CestaCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/types/Product';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PessoasQueAmoPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    aniversario: '',
    lembreteAniversario: false,
    lembreteDatas: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cestas'));
        const lista = snapshot.docs
          .map(doc => {
            const data = doc.data();

            // Extrai a primeira imagem válida
            let imageUrl: string | undefined;
            if (Array.isArray(data.image) && data.image.length > 0) {
              imageUrl = data.image[0]?.trim();
            } else if (typeof data.image === 'string') {
              imageUrl = data.image.trim();
            }

            return {
              id: doc.id,
              title: typeof data.title === 'string' ? data.title : undefined,
              price: typeof data.price === 'number' ? data.price : undefined,
              rating: typeof data.rating === 'number' ? data.rating : undefined,
              image: imageUrl,
              bestseller: data.bestseller === true,
            };
          })
          .filter(item => item.title && item.image);

        setProdutos(lista);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const produtosParaExibir = showAll ? produtos : produtos.slice(0, 4);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cidade || !form.aniversario) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        {/* Cabeçalho */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Pessoas que Amo 
        </h1>
        <p className="text-sm text-gray-600 text-center mb-10">
          Cadastre pessoas especiais para receber lembretes e sugestões de presentes.
        </p>

        {/* Formulário principal */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md space-y-6
           max-w-3xl mx-auto p-6 border border-gray-100"
        >
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo 
            </label>
            <input
              id="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
              Cidade 
            </label>
            <input
              id="cidade"
              type="text"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Ex: São Paulo"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label htmlFor="aniversario" className="block text-sm font-medium text-gray-700 mb-1">
              Data de aniversário 
            </label>
            <input
              id="aniversario"
              type="date"
              value={form.aniversario}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <section className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Lembretes automáticos
            </h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  id="lembreteAniversario"
                  type="checkbox"
                  checked={form.lembreteAniversario}
                  onChange={handleChange}
                  className="mr-3 accent-red-900"
                />
                <span className="text-gray-700">
                  Ativar lembrete de aniversário
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  id="lembreteDatas"
                  type="checkbox"
                  checked={form.lembreteDatas}
                  onChange={handleChange}
                  className="mr-3 accent-red-900"
                />
                <span className="text-gray-700">
                  Ativar lembrete de datas especiais
                </span>
              </label>
            </div>
          </section>
        {/* Seção de sugestões */}
        <section className="mt-16">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Sugestões inteligentes de presentes:
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="h-8 w-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : produtos.length === 0 ? (
            <p className="text-center text-gray-600">Nenhuma cesta encontrada.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtosParaExibir.map(produto => (
                  <CestasCard
                    key={produto.id}
                    id={produto.id}
                    title={produto.title || 'Sem título'}
                    price={produto.price}
                    rating={produto.rating}
                    image={produto.image || '/images/p1.png'}
                    bestseller={produto.bestseller}
                    showPrice={false}
                    showViewDetails={false}
                  />
                ))}
              </div>

              {produtos.length > 2 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAll(prev => !prev)}
                    className="px-6 py-2 border border-rose-600 text-rose-600 rounded-full hover:bg-rose-600 hover:text-white transition"
                  >
                    {showAll ? 'Mostrar menos' : 'Ver mais sugestões'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

          <button
            type="submit"
            className="w-full bg-red-900 text-white py-3 rounded-full font-medium hover:bg-red-900 transition"
          >
            Cadastrar
          </button>

          {submitted && (
            <div className="flex items-center justify-center text-green-600 gap-2 mt-3">
              <CheckCircleIcon className="h-5 w-5" />
              <p>Pessoa cadastrada com sucesso!</p>
            </div>
          )}
        </form>


      </main>

      <Footer />
    </div>
  );
}
