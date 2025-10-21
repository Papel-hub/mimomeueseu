'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TiposEntregaPage() {
  const router = useRouter();

  const [tipoEntrega, setTipoEntrega] = useState<'fisico' | 'digital' | 'ambos' | null>(null);
  const [dataAgendamento, setDataAgendamento] = useState<string>('');
  const [horaAgendamento, setHoraAgendamento] = useState<string>('');
  const [formasEntrega, setFormasEntrega] = useState({
    correios: false,
    transportadora: false,
    delivery: false,
    userMail: false,
    portaBalcão: false,
  });

  const diasDisponiveis = Array.from({ length: 30 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  const toggleFormaEntrega = (key: keyof typeof formasEntrega) => {
    setFormasEntrega((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContinue = () => {
    if (!tipoEntrega) return;

    localStorage.setItem('mimo_tipo_entrega', tipoEntrega);
    localStorage.setItem('mimo_data_agendamento', dataAgendamento);
    localStorage.setItem('mimo_hora_agendamento', horaAgendamento);
    localStorage.setItem('mimo_formas_entrega', JSON.stringify(formasEntrega));

    router.push('/solicitar-cartao/confirmacao');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-6 sm:px-12 pt-24 pb-10 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Tipos de Entrega
        </h1>

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
            <p className="text-gray-400 text-sm">
              Obs: Compartilhamento sem recompensas
            </p>
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

          {/* Agendamento */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Agendamento</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                <div
                  key={dia}
                  className="text-xs text-center font-medium text-gray-500"
                >
                  {dia}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {diasDisponiveis.map((dia) => (
                <div
                  key={dia}
                  onClick={() => setDataAgendamento(dia)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors ${
                    dataAgendamento === dia
                      ? 'bg-red-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {dia}
                </div>
              ))}
            </div>

            <input
              type="time"
              value={horaAgendamento}
              onChange={(e) => setHoraAgendamento(e.target.value)}
              className="w-full mt-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Escolha um horário"
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
                  ? 'bg-red-800 hover:bg-red-900'
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
