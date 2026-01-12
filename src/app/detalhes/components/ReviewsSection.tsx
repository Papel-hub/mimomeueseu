import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewsSectionProps {
  reviewCount: number;
}

export default function ReviewsSection({ reviewCount }: ReviewsSectionProps) {
  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-slide-in">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
        Avaliações ({reviewCount})
      </h2>
      
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="pb-6 border-b border-gray-50 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">Cliente {i}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, j) => (
                  <StarIcon key={j} className="h-4 w-4" />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm italic leading-relaxed">
              A cesta chegou perfeita! Os itens são de altíssima qualidade e a apresentação é impecável. Com certeza comprarei novamente.
            </p>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm font-semibold text-red-900 hover:text-red-700 transition-colors">
        Ver todas as avaliações
      </button>
    </section>
  );
}