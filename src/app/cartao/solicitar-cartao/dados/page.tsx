// app/solicitar-cartao/dados/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DadosCartaoPage() {
  const router = useRouter();

  // Estados para os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    cidade: '',
    estado: '',
    cep: '',
    mensagem: '', // só para presente
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modo, setModo] = useState<'proprio' | 'presente' | null>(null);
  const [tipoEntrega, setTipoEntrega] = useState<'fisico' | 'digital' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega escolhas anteriores
  useEffect(() => {
    const savedModo = localStorage.getItem('mimo_tipo_cartao') as 'proprio' | 'presente' | null;
    const savedTipo = localStorage.getItem('mimo_tipo_entrega') as 'fisico' | 'digital' | null;

    if (!savedModo || !savedTipo) {
      router.push('/solicitar-cartao');
      return;
    }

    setModo(savedModo);
    setTipoEntrega(savedTipo);
  }, [router]);

  const isPresente = modo === 'presente';
  const isFisico = tipoEntrega === 'fisico';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa erro ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (isPresente) {
      if (!formData.mensagem.trim()) newErrors.mensagem = 'Mensagem é obrigatória';
    }

    if (isFisico) {
      if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
      if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
      if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
      if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
      if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // 🟢 Simula envio para API
    setTimeout(() => {
      // Salva dados no localStorage (apenas para demonstração)
      localStorage.setItem('mimo_dados_cartao', JSON.stringify({ ...formData, modo, tipoEntrega }));

      // Simula geração de ID do cartão
      localStorage.setItem('mimo_cartao_id', 'MIMO_' + Date.now().toString(36).toUpperCase());

      // Redireciona para confirmação ou dashboard
      if (isPresente) {
        router.push('/solicitar-cartao/sucesso-presente');
      } else {
        router.push('/meu-cartao'); // Já tem cartão, vai pro dashboard
      }
    }, 800);
  };

  if (!modo || !tipoEntrega) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-rose-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isPresente ? 'Dados do Presenteado' : 'Seus Dados'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isPresente
              ? 'Informe os dados de quem receberá o cartão.'
              : 'Precisamos de algumas informações para criar seu cartão.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6">
          {/* Nome */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {isPresente ? 'Nome do presenteado' : 'Seu nome completo'}
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                errors.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Ana Silva"
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          {/* E-mail */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {isPresente ? 'E-mail do presenteado' : 'Seu e-mail'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="exemplo@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {!isPresente && (
            <>
              {/* CPF (só para próprio) */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="000.000.000-00"
                />
              </div>

              {/* Telefone */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Telefone (opcional)</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </>
          )}

          {/* Mensagem personalizada (só para presente) */}
          {isPresente && (
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Mensagem personalizada
              </label>
              <textarea
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                  errors.mensagem ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Escreva uma mensagem carinhosa..."
              />
              {errors.mensagem && <p className="text-red-500 text-sm mt-1">{errors.mensagem}</p>}
            </div>
          )}

          {/* Endereço (só se for físico) */}
          {isFisico && (
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {isPresente ? 'Endereço de entrega do presente' : 'Seu endereço'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                      errors.cep ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="00000-000"
                  />
                  {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                      errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SP"
                  />
                  {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.cidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="São Paulo"
                />
                {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    errors.endereco ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Rua das Flores, 123"
                />
                {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                      errors.numero ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123"
                  />
                  {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Complemento (opcional)</label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Apto 50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-full font-medium text-white transition-colors ${
                isSubmitting
                  ? 'bg-rose-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}