'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaGift } from 'react-icons/fa';

import {
  FaUsers,
  FaHeart,
  FaUserFriends,
  FaBriefcase,
  FaCalendarAlt,
  FaSmile,
} from 'react-icons/fa';

type CategoryKey =
  | 'familia'
  | 'relacionamentos'
  | 'amizades'
  | 'profissional'
  | 'ocasiao'
  | 'universal';

interface Category {
  id: CategoryKey;
  title: string;
  icon: React.ReactNode; 
  label: string;
  options: string[];
}

const CATEGORIES: Record<CategoryKey, Category> = {
  familia: {
    id: 'familia',
    title: 'Família',
    icon: <FaUsers className="text-red-900" />,
    label: 'Presentear Família',
    options: [
      'Mãe', 'Pai', 'Filha', 'Filho', 'Avó', 'Avô',
      'Irmã', 'Irmão', 'Tia', 'Tio', 'Prima', 'Primo',
      'Sogra', 'Sogro', 'Cunhada', 'Cunhado',
    ],
  },
  relacionamentos: {
    id: 'relacionamentos',
    title: 'Relacionamentos',
    icon: <FaHeart className="text-red-900" />,
    label: 'Presentear Relacionamentos',
    options: [
      'Namorada', 'Namorado', 'Esposa', 'Esposo', 'Noiva', 'Noivo',
      'Ficante', 'Paquera', 'Amor secreto', 'Relação à distância',
    ],
  },
  amizades: {
    id: 'amizades',
    title: 'Amigos e Convivência',
    icon: <FaUserFriends className="text-red-900" />,
    label: 'Presentear Amizades',
    options: [
      'Amiga', 'Amigo', 'Melhor amiga', 'Melhor amigo', 'Colega',
      'Vizinha', 'Vizinho', 'Companheiro de trabalho', 'Chefe', 'Cliente',
    ],
  },
  profissional: {
    id: 'profissional',
    title: 'Parceiros e Profissionais',
    icon: <FaBriefcase className="text-red-900" />,
    label: 'Presentear Profissional',
    options: [
      'Parceiro comercial', 'Cliente especial', 'Mentor', 'Professor',
      'Prestador de serviço', 'Colaborador', 'Fornecedor',
      'Empresário', 'Empreendedora',
    ],
  },
  ocasiao: {
    id: 'ocasiao',
    title: 'Ocasiões',
    icon: <FaCalendarAlt className="text-red-900" />,
    label: 'Presentear por Ocasião',
    options: [
      'Aniversário', 'Recuperação / Doença', 'Formatura',
      'Conquista / Promoção', 'Luto e Condolências',
      'Nova mamãe / Bebê', 'Mudança',
    ],
  },
  universal: {
    id: 'universal',
    title: 'Presentes Universais',
    icon: <FaSmile className="text-red-900" />,
    label: 'Presentear Universal',
    options: [
      'Para alguém especial', 'Para agradecer', 'Para pedir desculpas',
      'Para surpreender', 'Sem motivo', 'Para animar alguém',
    ],
  },
};

const CATEGORY_ORDER: CategoryKey[] = [
  'familia',
  'relacionamentos',
  'amizades',
  'profissional',
  'ocasiao',
  'universal',
];

export default function PresenterPage() {
  const params = useParams();
  const router = useRouter();

  const cestaId = (params?.id as string) ?? '';

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  const handleCategorySelect = (categoryId: CategoryKey) => {
    setSelectedCategory(categoryId);
  };

  const handleOptionSelect = (option: string) => {
    if (!selectedCategory) return;

    const url = `/presenter/continuar/${cestaId}?categoria=${selectedCategory}&destinatario=${encodeURIComponent(option)}`;

    router.push(url);
  };

  // ————————————————————————
  // Tela de opções da categoria
  // ————————————————————————
  if (selectedCategory) {
    const category = CATEGORIES[selectedCategory];

    return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
                <div className="max-w-5xl mx-auto space-y-8">

        <button
          onClick={() => setSelectedCategory(null)}
          className="text-red-900 mb-4 flex items-center"
        >
          ← Voltar 
        </button>

        <h2 className="text-xl font-bold mb-4">{category.label}</h2>

        <div className="space-y-3">
          {category.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-red-50 transition"
            >
              {option}
            </button>
          ))}
        </div>
        </div>
      </main>
      <Footer />
      </div>
    );
  }

  // ————————————————————————
  // Tela inicial com as categorias
  // ————————————————————————
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center gap-2">
          Para quem é o presente?
          <FaGift className="text-red-900 text-2xl" aria-hidden="true" />
        </h1>

      <div className="space-y-4">
        {CATEGORY_ORDER.map((key) => {
          const cat = CATEGORIES[key];

          return (
            <button
              key={key}
              onClick={() => handleCategorySelect(key)}
              className="w-full flex items-center gap-4 p-4 border border-red-900 rounded-lg hover:bg-red-50 transition text-red-900"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          );
        })}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
