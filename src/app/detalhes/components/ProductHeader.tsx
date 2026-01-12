import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

interface ProductHeaderProps {
  title: string;
  rating: number;
  reviewCount: number;
}

export default function ProductHeader({ title, rating, reviewCount }: ProductHeaderProps) {
  return (
    <header className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h1>
      <div className="flex items-center mt-3">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            i < Math.floor(rating) 
              ? <StarIcon key={i} className="h-5 w-5" /> 
              : <StarOutline key={i} className="h-5 w-5 text-gray-300" />
          ))}
        </div>
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)} 
          <span className="text-gray-400 font-normal ml-1">
            ({reviewCount} avaliações)
          </span>
        </span>
      </div>
    </header>
  );
}