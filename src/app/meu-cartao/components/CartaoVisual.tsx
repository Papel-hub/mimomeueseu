'use client';

import Image from 'next/image';

export default function CartaoVisual({
  nome,
  cardNumber,
}: {
  nome: string;
  cardNumber: string;
}) {
    console.log('🚀 CartaoVisual props:', { nome, cardNumber });
  return (
    <div className="space-y-6">
      <div className="relative flex justify-center">
        <Image
          src="/images/cartaouser.svg"
          alt="Cartão"
          width={250}
          height={250}
          className="object-contain w-full max-w-xs select-none"
        />
        <div className="font-semibold text-3xl text-white absolute top-[70%] left-[8%] 
        whitespace-pre-line break-words overflow-hidden">
          {nome}
        </div>
<div
  className="font-semibold text-white text-xl absolute top-[83%] left-[8%]  p-1 z-10"
  style={{ fontFamily: 'monospace' }}
>
  {cardNumber}
</div>
      </div>
    </div>
  );
}