//entrega/page.tsx
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
  const [formasEntrega, setFormasEntrega] = useState({
    correios: false,
    transportadora: false,
    delivery: false,
    userMail: false,
    portaBalcão: false,
  });

  // Mock de dias disponíveis (apenas para exemplo)
  const diasDisponiveis = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
  ];

  const handleContinue = () => {
    if (!tipoEntrega) return;

    // Salva no localStorage (opcional)
    localStorage.setItem('mimo_tipo_entrega', tipoEntrega);
    localStorage.setItem('mimo_data_agendamento', dataAgendamento);
    localStorage.setItem('mimo_formas_entrega', JSON.stringify(formasEntrega));

    router.push('/solicitar-cartao/confirmacao');
  };

  const toggleFormaEntrega = (key: keyof typeof formasEntrega) => {
    setFormasEntrega(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Tipos de entrega</h1>

        <div className="max-w-md mx-auto space-y-6 border rounded-lg border-gray-300 ">
          {/* Opções de entrega */}
          <div className="space-y-4">
            <div
              onClick={() => setTipoEntrega('fisico')}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                tipoEntrega === 'fisico'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="tipoEntrega"
                  checked={tipoEntrega === 'fisico'}
                  onChange={() => {}}
                  className="mt-1 mr-2"
                />
                <div>
                  <h3 className=" text-gray-800">Cartão Físico
                    <span className="text-gray-400 text-sm p-2">(Prazo de 10 dias úteis)</span>
                    </h3>
                </div>
              </div>
            </div>

            <div
              onClick={() => setTipoEntrega('digital')}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                tipoEntrega === 'digital'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="tipoEntrega"
                  checked={tipoEntrega === 'digital'}
                  onChange={() => {}}
                  className="mt-1 mr-2"
                />
                <div>
                  <h3 className=" text-gray-800">Cartão Digital
                    <span className="text-gray-400 p-2 text-sm ">(Prazo de 24 horas)</span>
                  </h3>
                </div>
              </div>
            </div>

            <div
              onClick={() => setTipoEntrega('ambos')}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                tipoEntrega === 'ambos'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="tipoEntrega"
                  checked={tipoEntrega === 'ambos'}
                  onChange={() => {}}
                  className="mr-2"
                />
                <div>
                  <h3 className="text-gray-800">Ambos</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Compartilhar nas redes sociais */}
          <div className="bg-white p-4 rounded-lg justify-center ">
            <h3 className="font-medium text-gray-800 mb-2 text-center">Compartilhar nas redes sociais:</h3>
            <div className="flex gap-4 justify-center">
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
            <p className="text-gray-400 p-2 text-center text-sm ">Obs: Compartinhamento sem recompensas</p>
          </div>
          <div>
         <label className="block text-sm font-medium text-gray-700">Informe o arroba da pessoa (Opcional)</label>
        <input
            name="@"
            type="email"
            className="w-full mt-1 p-2 mr-2  border border-gray-300 rounded-lg"
            placeholder="@da pessoa que deseja enviar"
            required
        />
            </div>

          {/* Agendamento */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Agendamento</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <div key={dia} className="text-xs text-center font-medium text-gray-500">
                  {dia}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {diasDisponiveis.map((dia, i) => (
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
          </div>
        <div>
        <input
            name="hora"
            type="data"
            className="w-full mt-1 p-2 mr-2  border border-gray-300 rounded-lg"
            placeholder="Escolha um horario"
            required
        />
            </div>

          {/* Formas de entrega */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Formas de entrega</h3>
            <div className="space-y-2">
              {Object.entries(formasEntrega).map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="radio"
                    id={key}
                    checked={value}
                    onChange={() => toggleFormaEntrega(key as keyof typeof formasEntrega)}
                    className="mr-2 border"
                  />
                  <label htmlFor={key} className="text-gray-700 text-sm">
                    {key === 'correios' && 'Correios'}
                    {key === 'transportadora' && 'Transportadora'}
                    {key === 'delivery' && 'Delivery'}
                    {key === 'userMail' && 'User Mail'}
                    {key === 'portaBalcão' && 'Porta do Balcão'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="space-y-3">
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