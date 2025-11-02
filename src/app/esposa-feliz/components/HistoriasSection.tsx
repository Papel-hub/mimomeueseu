import { FaBook } from 'react-icons/fa';

export function HistoriasSection() {
  const historias = [
    {
      nome: 'Carla, 34 – São Paulo',
      texto: 'Depois do divórcio, me sentia invisível. Uma amiga me indicou como “Esposa Feliz” e recebi uma carta da Mimo dizendo: “Você é inteira sozinha”. Chorei. Hoje sou eu quem indica outras mulheres.',
    },
    {
      nome: 'Mariana, 28 – Belo Horizonte',
      texto: 'Meu marido nunca sabia o que me dar. Criei minha lista de desejos e ele escolheu a cesta “Amor em Detalhes”. Foi o gesto mais lindo do ano.',
    },
  ];

  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-10 bg-rose-200 rounded-full"></div>
        <FaBook size={32} className="text-rose-200" />
        <h2 className="text-2xl font-semibold">Histórias de Amor e Superação</h2>
      </div>
      <div className="space-y-6">
        {historias.map((h, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-[#FDE8E9] shadow-sm">
            <p className="text-gray-700 italic mb-3">“{h.texto}”</p>
            <p className="font-medium text-[#5A4A42]">— {h.nome}</p>
          </div>
        ))}
      </div>
      <button className="mt-6 text-rose-200 font-medium hover:underline">
        + Ver mais histórias
      </button>
    </section>
  );
}