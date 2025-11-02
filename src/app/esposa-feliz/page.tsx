import { AutoamorSection } from './components/AutoamorSection';
import { IndiqueMulherSection } from './components/IndiqueMulherSection';
import { ListaDesejosSection } from './components/ListaDesejosSection';
import { HistoriasSection } from './components/HistoriasSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function EsposaFelizPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
            <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
      {/* Hero Banner */}
      <header className="bg-gradient-to-r from-[#FCE1D0] to-red-900 rounded-lg text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Esposa Feliz</h1>

        </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Um movimento de amor, cuidado e valorização da mulher — porque você merece ser mimada todos os dias.
          </p>
      </header>

        {/* Introdução */}
        <section className="text-center mb-16">
          <p className="text-gray-700 max-w-3xl mt-1 mx-auto text-lg">
            Aqui, o presente é um gesto de amor — para você, para ela, para todas nós.  
            Seja uma <span className="font-semibold text-[#FCE1D0]">Esposa Feliz</span> e espalhe carinho pelo mundo.
          </p>
        </section>

        {/* Seções */}
        <AutoamorSection />
        <IndiqueMulherSection />
        <ListaDesejosSection />
        <HistoriasSection />

        {/* Call to Action Final */}
        <section className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 border border-[#FCE1D0]/30 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Pronta para se tornar uma Esposa Feliz?
            </h2>
            <p className="text-gray-600 mb-6">
              Junte-se a milhares de mulheres que já transformaram seus dias com amor, cuidado e presentes Mimo.
            </p>
            <button className="bg-[#FCE1D0] text-white px-8 py-3 rounded-full font-medium hover:bg-[#c8961e] transition">
              Começar Agora
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}