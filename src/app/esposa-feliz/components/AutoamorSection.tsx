import { FaHandHoldingHeart } from 'react-icons/fa';

export function AutoamorSection() {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-10 bg-rose-200 rounded-full"></div>
          <FaHandHoldingHeart size={32} className="text-rose-200" />
          <h2 className="text-2xl font-semibold text-gray-800">Autoamor</h2>
      </div>
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-rose-200/20 shadow-sm">
        <p className="text-gray-700 mb-6">
          Presentear-se não é vaidade — é autocuidado. Escolha cestas, cartas personalizadas, perfumes e experiências 
          que celebram <strong>você</strong>, sua força e sua beleza.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Carta de Amor para Mim', 'Cesta Autoamor com Flores', 'Experiência Sensorial Mimo'].map((item, i) => (
            <div key={i} className="border border-[#FDE8E9] rounded-xl p-4 text-center hover:bg-[#FDE8E9] transition">
              <div className="text-rose-200 font-bold mb-2">•</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <button className="mt-6 bg-rose-200 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#e89fa2] transition">
          Ver opções de auto presente
        </button>
      </div>
    </section>
  );
}