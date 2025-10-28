'use client';
import { useRouter, useParams } from "next/navigation"; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';


export default function EsposaFelizPage() { 
  const params = useParams(); 
  const id = params.id as string; 
  const router = useRouter();

 
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">


        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Esposa Feliz!</h1>
        <p className="text-sm text-gray-600 text-center mb-8">soiuytrjhg.</p>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
        
            <div className="border-b pb-6 last:border-b-0">
              <h2 className="font-semibold text-lg text-gray-800 mb-3"></h2>


            </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push(`/mensagem/${id}`)}
            className="w-full flex items-center bg-red-900 font-bold text-white justify-center gap-2 p-3 border border-gray-300 rounded-full hover:bg-red-800 transition"
          >
            Continuar
          </button>
          <Link
            href={`/cestas/${id}`}
            className="w-full flex items-center justify-center gap-2 font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-100 transition"
          >
            Cancelar
          </Link>
        </div>
        </div>  
      </main>

      <Footer />
    </div>
  );
}
