'use client';

import { useRouter, useParams } from "next/navigation";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function InfluenciadorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    redeSocial: '',
    mensagem: '',
  });
  const [, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validação simples
    if (!formData.nome.trim() || !formData.email.trim() || !formData.redeSocial.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('E-mail inválido.');
      return;
    }

    setLoading(true);

    try {
      // Aqui você integraria com sua API/backend
      // Ex: await fetch('/api/influenciador', { method: 'POST', body: JSON.stringify(formData) });

      // Simulando envio bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirecionar após sucesso
      router.push(`/mensagem/${id}`);
    } catch (err) {
      setError('Erro ao enviar cadastro. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Seja um Influenciador(a)!</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Tem público nas redes sociais? Faça parte do nosso time de parceiros.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-gray-300 pb-6 last:border-b-0">
            <h2 className="font-medium text-gray-900 mb-2">Benefícios exclusivos</h2>
            <ul className="text-sm text-red-900 space-y-1 list-disc pl-5">
              <li>Código de desconto exclusivo</li>
              <li>Link personalizado para divulgação</li>
              <li>Comissão por cada venda</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo 
              </label>
              <input
                placeholder="Digite o seu nome completo"
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail 
              </label>
              <input
                placeholder="Digite o seu email "
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="redeSocial" className="block text-sm font-medium text-gray-700 mb-1">
                Rede social principal / @usuário 
              </label>
              <input
                placeholder="Rede social principal / @usuário "
                id="redeSocial"
                name="redeSocial"
                type="text"
                value={formData.redeSocial}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
              placeholder="Sua mensagem aqui "
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="midia" className="block text-sm font-medium text-gray-700 mb-1">
                Enviar mídia (opcional)
              </label>
              <input
                id="midia"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600 mt-4">
              Acesso liberado após análise da equipe.
            </p>

            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-red-900 font-bold text-white gap-2 p-3 rounded-full hover:bg-red-800 transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar cadastro'
                )}
              </button>

              <Link
                href={`/cestas/${id}`}
                className="w-full flex items-center justify-center font-bold p-3 border border-red-900 text-red-900 rounded-full hover:bg-gray-100 transition text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}