'use client';
import { useRouter} from "next/navigation";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function ConfirmacaoPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8 max-w-lg mx-auto">
        {/* Animação de sucesso */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 12 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CheckIcon className="h-10 w-10 text-white" />
            </motion.div>
          </motion.div>
        </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Pedido confirmado com sucesso
            </h1>
            <p className="text-sm font-semibold text-red-900 mt-2 border-b border-gray-200 pb-4">
              Sua cesta está sendo preparada
            </p>
          </div>

          {/* Entrega */}
          <div className="text-center border-b border-gray-200 pb-6 space-y-2">
            <p className="text-sm font-semibold text-gray-900">Entrega física:</p>
            <p className="text-sm text-gray-700">Entrega agendada para:</p>
            <p className="text-sm text-gray-700">
              Acompanha cartão de membro com QR code
            </p>
          </div>

          {/* Verificação da cesta */}
          <div className="border-b border-gray-200 pb-6 space-y-3">
            <p className="text-sm font-semibold text-gray-900 text-center">
              Verificação da cesta:
            </p>

            <button
              className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition"
            >
              Escanear o QR code do cartão de membro
            </button>

            <button
              className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-full font-bold text-gray-800 hover:bg-gray-100 transition"
            >
              Ver a cesta digital
            </button>
          </div>

          {/* Compartilhar nas redes */}
          <div className="border-b border-gray-200 pb-6 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Compartilhar nas redes sociais:
            </p>
            <div className="flex justify-center items-center gap-4">
              <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition">
                <Image src="/images/facebook.svg" alt="Facebook" width={30} height={30} />
              </button>
              <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition">
                <Image src="/images/tiktok.svg" alt="Google" width={30} height={30} />
              </button>
            <Link
              href="https://www.instagram.com/mimomeueseu/"
              className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
              ><Image src="/images/instagram.svg" alt="Instagram" width={30} height={30} />
            </Link>
            </div>
          </div>

          {/* Ações finais */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-900 text-white font-bold rounded-full hover:bg-red-800 transition"
            >
              Voltar ao início
            </button>

            <Link
              href="/cestas"
              className="w-full flex items-center justify-center gap-2 p-3 border border-red-900 text-red-900 font-bold rounded-full hover:bg-gray-50 transition"
            >
              Ver meus pedidos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
