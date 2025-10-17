"use client";

import Image from "next/image";



export default function WelcomeMobilePage() {


  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-red-900 p-6 text-center">
    <div className=" mb-6 flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="Mimo Meu e Seu"
          width={140}
          height={140}
          priority
        />
      </div>  

      {/* Texto e Botões */}
      <div className="space-y-6 max-w-sm w-full">
        <p className="text-lg font-medium text-[#FCE1D0]">
          Palavras dizem. Atitudes provam.
          <br />
          <strong className="font-bold">Surpreender quem você ama!</strong>
        </p>

        <button
          onClick={() => (window.location.href = "/auth/login")}
          className="w-full bg-[#FCE1D0] py-4 px-3 text-red-900 font-semibold rounded-full hover:bg-red-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Entrar na sua conta"
        >
          Entrar
        </button>

        <button
          onClick={() => (window.location.href = "/home")}
          className="w-full border border-[#FCE1D0] py-4 px-3 text-[#FCE1D0] font-semibold rounded-full hover:bg-red-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#FCE1D0] focus:ring-opacity-50"
          aria-label="Criar uma nova conta"
        >
          Continuar como visitante
        </button>
      </div>
    </div>
  );
}