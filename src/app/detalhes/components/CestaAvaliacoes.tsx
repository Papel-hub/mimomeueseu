import { StarIcon } from '@heroicons/react/24/outline';
import { Cesta } from '@/types/cesta';

type CestaAvaliacoesProps = {
  cesta: Cesta;
};

export default function CestaAvaliacoes({ cesta }: CestaAvaliacoesProps) {
  // Simulando avaliações estáticas (substitua por dados reais quando tiver)
  const avaliacoesExemplo = [
    { nome: 'Cliente 1', nota: 5, comentario: 'Cesta fresquíssima e linda! Chegou perfeita para o presente.' },
    { nome: 'Cliente 2', nota: 4, comentario: 'Ótima qualidade, mas demorou um pouco na entrega.' },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <h2 className="font-semibold text-lg text-gray-800 mb-3">Avaliações ({cesta.reviewCount})</h2>
      <div className="space-y-5">
        {avaliacoesExemplo.map((av, i) => (
          <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center">
              <span className="font-medium">{av.nome}</span>
              <div className="ml-3 flex">
                {[...Array(5)].map((_, j) => (
                  <StarIcon
                    key={j}
                    className={`h-4 w-4 ${j < av.nota ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-gray-600">{av.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
}