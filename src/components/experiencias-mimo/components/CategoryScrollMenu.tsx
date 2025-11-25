'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  link: string;
}

interface CategoryScrollMenuProps {
  categories: Category[];
}

const CategoryScrollMenu = ({ categories }: CategoryScrollMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const updateArrowsVisibility = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const scrollEndMargin = 50;
    setIsLeftVisible(scrollLeft > 10);
    setIsRightVisible(scrollLeft < scrollWidth - clientWidth - scrollEndMargin);
  };

  useEffect(() => {
    updateArrowsVisibility();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 220;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative bg-red-900 text-white py-3 px-4 text-center item-center rounded-t-lg overflow-hidden">
      {/* Setas */}
      <button
        onClick={() => handleScroll('left')}
        className={`absolute left-2 top-1/2 z-10 p-2 text-center item-center rounded-full transition-all ${
          isLeftVisible ? 'opacity-100 bg-black/30 hover:bg-black/50' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar categorias para a esquerda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => handleScroll('right')}
        className={`absolute right-2 top-1/2 z-10 p-2 rounded-full  transition-all ${
          isRightVisible ? 'opacity-100 bg-black/30 hover:bg-black/50' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar categorias para a direita"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Lista de categorias com links reais */}
      <div
        ref={containerRef}
        onScroll={updateArrowsVisibility}
        className="flex items-center space-x-4 overflow-x-auto scrollbar-hide py-1 pl-8 pr-24"
        style={{ scrollBehavior: 'smooth' }}
        role="tablist"
        aria-label="Categorias de experiências"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/experiencias-mimo/${category.link}`}
            className="whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm bg-red-800/30 hover:bg-red-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-900"
            role="tab"
            prefetch={true}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryScrollMenu;