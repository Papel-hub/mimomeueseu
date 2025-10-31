'use client';

import { useState } from 'react';

export default function CadastroForm() {
  const [formData, setFormData] = useState({
    nome: '',
    cpfCnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    tipoAtuacao: 'ambos' as 'vendas' | 'entregas' | 'ambos',
    instagram: '',
    whatsapp: '',
    aceite: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aceite) {
      alert('É necessário aceitar os Termos de Parceria.');
      return;
    }
    // Aqui você enviaria para sua API
    console.log('Cadastro enviado:', formData);
    alert('Cadastro recebido! Entraremos em contato em breve.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="nome"
          placeholder="Nome completo *"
          value={formData.nome}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
        <input
          name="cpfCnpj"
          placeholder="CPF ou CNPJ *"
          value={formData.cpfCnpj}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
      </div>

      <input
        name="endereco"
        placeholder="Endereço completo (para geolocalização) *"
        value={formData.endereco}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="telefone"
          placeholder="Telefone (com DDD) *"
          value={formData.telefone}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail *"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Tipo de atuação *</label>
        <select
          name="tipoAtuacao"
          value={formData.tipoAtuacao}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        >
          <option value="vendas">Apenas vendas</option>
          <option value="entregas">Apenas entregas</option>
          <option value="ambos">Vendas e entregas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="instagram"
          placeholder="Instagram (ex: @seuusuario)"
          value={formData.instagram}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
        <input
          name="whatsapp"
          placeholder="WhatsApp (com DDD)"
          value={formData.whatsapp}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E4B1AE]"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="aceite"
          checked={formData.aceite}
          onChange={handleChange}
          className="mt-1 h-4 w-4 text-[#DAA520] rounded"
          required
        />
        <label className="text-sm text-gray-700">
          Li e aceito os{' '}
          <a href="/termos-cupidos" className="text-[#DAA520] underline">
            Termos de Parceria e Conduta Oficial da Mimo Meu e Seu
          </a>
          .
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#E4B1AE] to-[#DAA520] text-white py-3 rounded-full font-semibold hover:opacity-90 transition"
      >
        Enviar Cadastro
      </button>
    </form>
  );
}