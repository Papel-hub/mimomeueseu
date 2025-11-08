
import MapSection from './components/MapSection';
import  CadastroForm  from './components/CadastroForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CupidosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
      {/* Hero Section */}
      <header className="bg-red-900 rounded-xl text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />

              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Cupidos da Mimo</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Conectando gestos de amor com mãos e corações reais.
          </p>
        </div>
      </header>

        {/* Objetivos */}
        <section className="mb-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mt-1 mb-6">Por que se tornar um Cupido?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Expandir a presença da Mimo',
              'Facilitar compras com atendimento humano',
              'Criar oportunidades de renda',
              'Fortalecer vínculos emocionais',
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-[#E4B1AE]/30">
                <div className="text-[#DAA520] font-bold text-lg mb-2">•</div>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mapa e Lista */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Encontre um Cupido perto de você</h2>
          <MapSection />
        </section>

        {/* Cadastro */}
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#E4B1AE]/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quer se tornar um Cupido Oficial?</h2>
          <p className="text-gray-600 mb-6">
            Preencha o formulário e faça parte da rede que espalha amor, carinho e conexões reais.
          </p>
          <CadastroForm />
        </section>

        {/* Benefícios */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Benefícios para Cupidos</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto text-gray-700">
            {[
              'Comissão sobre vendas via seu token',
              'Acesso antecipado a produtos e campanhas',
              'Material oficial de divulgação',
              'Treinamentos online de atendimento',
              'Possibilidade de virar Embaixador Regional',
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#DAA520] mt-1">✓</span> {benefit}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}