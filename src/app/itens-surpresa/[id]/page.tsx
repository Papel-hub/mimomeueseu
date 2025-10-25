// app/itens-surpresa/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TabButton from '../components/TabButton';
import ItemCard from '../components/ItemCard';
import Pagination from '../components/Pagination';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

type Item = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: 'produto' | 'servico';
};

export default function ItensSurpresaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [activeTab, setActiveTab] = useState<'Produtos' | 'Serviços'>('Produtos');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Carregar itens do Firestore
  useEffect(() => {
    if (!id) {
      router.push('/cestas');
      return;
    }

    const fetchItems = async () => {
      try {
        const categoria = activeTab === 'Produtos' ? 'produto' : 'servico';
        const q = query(collection(db, 'itens_surpresa'), where('categoria', '==', categoria));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Item[];

        setItems(data);
      } catch (err) {
        console.error('Erro ao carregar itens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeTab, id, router]);

  // Paginação
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  if (!id) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Itens Surpresa</h1>

        {/* Abas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['Produtos', 'Serviços'] as const).map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // Resetar página ao trocar aba
              }}
            />
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Carregando itens...</p>
          </div>
        ) : (
          <>
            {/* Lista de itens */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                  <ItemCard key={item.id} item={item} cestaId={id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nenhum item disponível nesta categoria.</p>
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}