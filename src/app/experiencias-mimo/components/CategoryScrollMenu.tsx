'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
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
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrowsVisibility);
      return () => container.removeEventListener('scroll', updateArrowsVisibility);
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 220;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Verifica se a categoria está ativa com base na URL
  const isActive = (categoryLink: string) => {
    return pathname === `/experiencias-mimo/categoria/${categoryLink}`;
  };

  return (
    <div className="relative bg-red-900 text-white py-3 px-4 rounded-t-lg overflow-hidden">
      {/* Setas de navegação */}
      <button
        onClick={() => handleScroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-opacity ${
          isLeftVisible ? 'opacity-100 bg-black/30 hover:bg-black/50' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar categorias para a esquerda"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => handleScroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-opacity ${
          isRightVisible ? 'opacity-100 bg-black/30 hover:bg-black/50' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Rolar categorias para a direita"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Lista de categorias */}
      <div
        ref={containerRef}
        className="flex items-center space-x-4 overflow-x-auto scrollbar-hide py-1 pl-12 pr-12"
        style={{ scrollBehavior: 'smooth' }}
        role="tablist"
        aria-label="Categorias de experiências"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
href={`/experiencias-mimo/categoria/${category.link}`}
            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
              isActive(category.link)
                ? 'bg-white text-red-900 font-bold'
                : 'bg-red-800/30 text-white hover:bg-red-700/50'
            }`}
            role="tab"
            aria-selected={isActive(category.link)}
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