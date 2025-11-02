// app/components/CategoryScrollMenu.tsx
'use client';

import { useRef, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategoryScrollMenuProps {
  categories: Category[];
  onCategoryClick?: (category: Category) => void;
}

const CategoryScrollMenu = ({ categories, onCategoryClick }: CategoryScrollMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const scrollAmount = 200; // ajusta conforme necessário
    const currentScroll = containerRef.current.scrollLeft;

    if (direction === 'left') {
      containerRef.current.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth',
      });
    } else {
      containerRef.current.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const updateArrowsVisibility = () => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setIsLeftVisible(scrollLeft > 0);
    setIsRightVisible(scrollLeft < scrollWidth - clientWidth - 10); // margem de segurança
  };

  return (
    <div className="relative bg-red-900 text-white py-3 px-4 rounded-t-lg">
      {/* Setas de navegação */}
      <button
        onClick={() => handleScroll('left')}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-opacity ${
          isLeftVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar para esquerda"
        disabled={!isLeftVisible}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => handleScroll('right')}
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full transition-opacity ${
          isRightVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar para direita"
        disabled={!isRightVisible}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Container scrollável */}
      <div
        ref={containerRef}
        onScroll={updateArrowsVisibility}
        className="flex space-x-6 overflow-x-auto scrollbar-hide py-1 px-8"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick?.(category)}
            className="whitespace-nowrap px-4 py-2 rounded-md hover:bg-white/20 transition font-medium"
            aria-current={false} // pode ser true se for a categoria ativa
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScrollMenu;