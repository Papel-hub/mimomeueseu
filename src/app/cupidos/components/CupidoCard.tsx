import Image from 'next/image';

interface Cupido {
  id: string;
  name: string;
  location: string;
  services: ('vendas' | 'entregas' | 'ambos')[];
  avatar?: string;
  whatsapp?: string;
}

export default function CupidoCard({ name, location, services, avatar, whatsapp }: Cupido) {
  const serviceLabels = {
    vendas: 'Vendas',
    entregas: 'Entregas',
    ambos: 'Vendas + Entregas',
  };

  const handleWhatsApp = () => {
  if (whatsapp) {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    if (cleanNumber.length >= 10) {
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    } else {
      alert('Número de WhatsApp inválido.');
    }
  }
};

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-200/20 hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-3">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-rose-200/20 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {services.map((s) => (
          <span
            key={s}
            className="px-2 py-1 bg-[#fdf6f4] text-white text-xs rounded-full font-medium"
          >
            {serviceLabels[s]}
          </span>
        ))}
      </div>
      <button
        onClick={handleWhatsApp}
        disabled={!whatsapp}
        className={`w-full py-2 rounded-full text-sm font-medium transition ${
          whatsapp
            ? 'bg-rose-200 text-white hover:bg-rose-200 cursor-pointer'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        Entrar em contato
      </button>
    </div>
  );
}