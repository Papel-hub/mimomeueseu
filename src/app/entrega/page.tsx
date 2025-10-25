'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Função auxiliar: formata data para "DD/MM/YYYY"
const formatDate = (date: Date) => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

// Função auxiliar: gera dias do mês com suporte a semanas
const getDaysInMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = dom, 1 = seg...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  // Dias vazios antes do 1º
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

export default function TiposEntregaPage() {
  const router = useRouter();

  const [tipoEntrega, setTipoEntrega] = useState<'fisico' | 'digital' | 'ambos' | null>(null);
  const [dataAgendamento, setDataAgendamento] = useState<Date | null>(null);
  const [horaAgendamento, setHoraAgendamento] = useState<string>('');
  const [formasEntrega, setFormasEntrega] = useState({
    correios: false,
    transportadora: false,
    delivery: false,
    userMail: false,
    portaBalcão: false,
  });

  // Mídia
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  // Calendário
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Carregar mídia do localStorage
  useEffect(() => {
    const audio = localStorage.getItem('mimo_midia_audio');
    const video = localStorage.getItem('mimo_midia_video');
    setHasAudio(!!audio);
    setHasVideo(!!video);
  }, []);

  const toggleFormaEntrega = (key: keyof typeof formasEntrega) => {
    setFormasEntrega((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = () => {
    if (!tipoEntrega) return;

    localStorage.setItem('mimo_tipo_entrega', tipoEntrega);
    localStorage.setItem('mimo_data_agendamento', dataAgendamento ? formatDate(dataAgendamento) : '');
    localStorage.setItem('mimo_hora_agendamento', horaAgendamento);
    localStorage.setItem('mimo_formas_entrega', JSON.stringify(formasEntrega));

    router.push('/pagamento');
  };

  const days = getDaysInMonth(currentYear, currentMonth);
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < now;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-6 sm:px-12 pt-24 pb-10 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Tipos de Entrega
        </h1>

        {/* Resumo da mídia (opcional) */}
        {(hasAudio || hasVideo) && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            {hasAudio && <span>✅ Áudio incluído • </span>}
            {hasVideo && <span>🎥 Vídeo incluído • </span>}
            <button
              onClick={() => router.push('/midia?tipo=' + (hasVideo ? 'video' : 'audio'))}
              className="underline"
            >
              Editar
            </button>
          </div>
        )}

        <div className="max-w-md mx-auto space-y-6 border rounded-xl border-gray-200 bg-white shadow-sm p-6">
          {/* Tipos de entrega */}
          <div className="space-y-3">
            {[
              { key: 'fisico', label: 'Cartão Físico', prazo: 'Prazo de 10 dias úteis' },
              { key: 'digital', label: 'Cartão Digital', prazo: 'Prazo de 24 horas' },
              { key: 'ambos', label: 'Ambos', prazo: '' },
            ].map(({ key, label, prazo }) => (
              <div
                key={key}
                onClick={() => setTipoEntrega(key as 'fisico' | 'digital' | 'ambos')}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  tipoEntrega === key
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="tipoEntrega"
                    checked={tipoEntrega === key}
                    readOnly
                    className="mr-2 accent-red-600"
                  />
                  <div>
                    <h3 className="text-gray-800 font-medium">
                      {label}{' '}
                      {prazo && (
                        <span className="text-gray-400 text-sm ml-1">({prazo})</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compartilhar */}
          <div className="text-center">
            <h3 className="font-medium text-gray-800 mb-3">Compartilhar nas redes sociais</h3>
            <div className="flex gap-4 justify-center mb-2">
              <button className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
                <FaFacebook size={20} />
              </button>
              <button className="p-2 bg-pink-100 rounded-full text-pink-600 hover:bg-pink-200">
                <FaInstagram size={20} />
              </button>
              <button className="p-2 bg-green-100 rounded-full text-green-600 hover:bg-green-200">
                <FaWhatsapp size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm">Obs: Compartilhamento sem recompensas</p>
          </div>

          {/* Arroba */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Informe o arroba da pessoa (opcional)
            </label>
            <input
              name="arroba"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="@da pessoa que deseja enviar"
            />
          </div>

{/* Calendário com navegação entre meses */}
<div>
  <h3 className="font-medium text-gray-800 mb-2">Agendamento</h3>

  {/* Cabeçalho com navegação */}
  <div className="flex items-center justify-between mb-2">
    <button
      onClick={() => {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      }}
      className="text-gray-600 hover:text-gray-900"
      aria-label="Mês anterior"
    >
      &larr;
    </button>

    <div className="font-medium text-gray-700">
      {monthNames[currentMonth]} de {currentYear}
    </div>

    <button
      onClick={() => {
        if (currentMonth === 11) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }}
      className="text-gray-600 hover:text-gray-900"
      aria-label="Próximo mês"
    >
      &rarr;
    </button>
  </div>

  {/* Dias da semana */}
  <div className="grid grid-cols-7 gap-1 mb-1">
    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
      <div key={dia} className="text-xs text-center font-medium text-gray-500">
        {dia}
      </div>
    ))}
  </div>

  {/* Dias do mês */}
  <div className="grid grid-cols-7 gap-1">
    {days.map((date, idx) => {
      if (!date) {
        return <div key={idx} className="w-8 h-8"></div>;
      }

      const isSelected = dataAgendamento?.toDateString() === date.toDateString();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = isPastDate(date);

      return (
        <div
          key={idx}
          onClick={() => !isPast && setDataAgendamento(date)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${
            isSelected
              ? 'bg-red-600 text-white'
              : isToday
              ? 'bg-gray-200 text-gray-800'
              : isPast
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {date.getDate()}
        </div>
      );
    })}
  </div>

  {/* Campo de hora */}
  <input
    type="time"
    value={horaAgendamento}
    onChange={(e) => setHoraAgendamento(e.target.value)}
    className="w-full mt-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
  />
</div>

          {/* Formas de entrega */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Formas de entrega</h3>
            <div className="space-y-2">
              {Object.entries(formasEntrega).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={() => toggleFormaEntrega(key as keyof typeof formasEntrega)}
                    className="mr-2 accent-red-600"
                  />
                  <label htmlFor={key} className="text-gray-700 text-sm">
                    {key === 'correios' && 'Correios'}
                    {key === 'transportadora' && 'Transportadora'}
                    {key === 'delivery' && 'Delivery'}
                    {key === 'userMail' && 'E-mail do Usuário'}
                    {key === 'portaBalcão' && 'Porta do Balcão'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleContinue}
              disabled={!tipoEntrega}
              className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
                tipoEntrega
                  ? 'bg-red-900 hover:bg-red-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
            <button
              onClick={() => router.back()}
              className="w-full py-3 px-4 rounded-full font-medium text-gray-700 border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}