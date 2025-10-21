// app/solicitar-cartao/dados/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth } from '@/lib/firebaseConfig'; // db não é mais usado aqui

type Modo = 'proprio' | 'presente';
type TipoCartao = 'fisico' | 'digital';

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function DadosCartaoPage() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo | null>(null);
  const [tipoCartao, setTipoCartao] = useState<TipoCartao | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [endereco, setEndereco] = useState<Endereco>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  // Carrega escolhas anteriores
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedModo = localStorage.getItem('mimo_tipo_cartao') as Modo | null;
      const savedTipo = localStorage.getItem('mimo_tipo_entrega') as TipoCartao | null;

      if (!savedModo || !savedTipo) {
        router.push('/solicitar-cartao');
        return;
      }

      setModo(savedModo);
      setTipoCartao(savedTipo);
      setLoading(false);

      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user && savedModo === 'proprio') {
          setEmail(user.email || '');
        }
      });

      return () => unsubscribe();
    }
  }, [router]);

  const isPresente = modo === 'presente';
  const isFisico = tipoCartao === 'fisico';

  // 🔍 Busca CEP
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    setEndereco((prev) => ({ ...prev, cep: cep.slice(0, 8) }));

    if (cep.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setEndereco((prev) => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }));
        }
} catch {
  console.log('Erro desconhecido');
} finally {
        setCepLoading(false);
      }
    }
  };

  // ✅ handleSubmit corrigido — APENAS UM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    if (isPresente && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      setError('E-mail válido é obrigatório para presente.');
      return;
    }

    if (isFisico) {
      const { cep, logradouro, numero, bairro, cidade, estado } = endereco;
      if (!cep || cep.length !== 8) {
        setError('CEP inválido.');
        return;
      }
      if (!logradouro.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
        setError('Preencha todos os campos do endereço.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');

      const token = await user.getIdToken();

      const payload = {
        tipo: tipoCartao,
        modo,
        nome,
        email: isPresente ? email : user.email || '',
        mensagem: isPresente ? mensagem.trim() : null,
        ...(isFisico && { endereco }),
      };

      const res = await fetch('/api/solicitar-cartao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao solicitar cartão');
      }

      localStorage.removeItem('mimo_tipo_cartao');
      localStorage.removeItem('mimo_tipo_entrega');
      router.push(`/solicitar-cartao/sucesso?tipo=${tipoCartao}&modo=${modo}`);
} catch (err) {
  console.error('Erro:', err);
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Não foi possível concluir a solicitação.');
  }
} finally {
  setSubmitting(false);
}
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-600 border-r-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isPresente
                ? isFisico
                  ? 'Dados do presenteado e entrega'
                  : 'Dados do presenteado'
                : isFisico
                ? 'Seu endereço de entrega'
                : 'Seus dados'}
            </h1>
            <p className="text-gray-600">
              {isPresente
                ? isFisico
                  ? 'Informe os dados de quem receberá o presente e o endereço de entrega.'
                  : 'Informe os dados de quem receberá o cartão digital.'
                : isFisico
                ? 'Confirme seus dados e endereço para entrega do cartão físico.'
                : 'Confirme seus dados para ativar o cartão digital.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                {isPresente ? 'Nome do presenteado' : 'Seu nome'}
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Ex: Ana Silva"
                required
              />
            </div>

            {/* Email */}
            {(isPresente || !isFisico) && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {isPresente ? 'E-mail do presenteado' : 'Seu e-mail'}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isPresente && !!auth.currentUser?.email}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="exemplo@dominio.com"
                  required={isPresente}
                />
              </div>
            )}

            {/* Mensagem */}
            {isPresente && (
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem personalizada (opcional)
                </label>
                <textarea
                  id="mensagem"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Escreva uma mensagem para acompanhar o presente"
                  rows={2}
                />
              </div>
            )}

            {/* Endereço */}
            {isFisico && (
              <>
                <h2 className="text-lg font-medium text-gray-800 mt-6 mb-3">Endereço de entrega</h2>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <div className="flex">
                    <input
                      id="cep"
                      type="text"
                      value={endereco.cep}
                      onChange={handleCepChange}
                      className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {cepLoading && (
                      <div className="flex items-center px-3 bg-gray-100 rounded-r-lg">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-rose-600 border-r-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-1">
                    Rua
                  </label>
                  <input
                    id="logradouro"
                    type="text"
                    value={endereco.logradouro}
                    onChange={(e) => setEndereco({ ...endereco, logradouro: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      id="numero"
                      type="text"
                      value={endereco.numero}
                      onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      id="complemento"
                      type="text"
                      value={endereco.complemento}
                      onChange={(e) => setEndereco({ ...endereco, complemento: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    id="bairro"
                    type="text"
                    value={endereco.bairro}
                    onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      id="cidade"
                      type="text"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco({ ...endereco, cidade: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      id="estado"
                      type="text"
                      value={endereco.estado}
                      onChange={(e) => setEndereco({ ...endereco, estado: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      maxLength={2}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-full font-medium text-white transition-colors ${
                submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-900 hover:bg-red-800'
              }`}
            >
              {submitting
                ? `Solicitando cartão ${isFisico ? 'físico' : 'digital'}...`
                : `Solicitar Cartão ${isFisico ? 'Físico' : 'Digital'}`}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}