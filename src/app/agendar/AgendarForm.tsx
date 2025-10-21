'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AgendarForm({
  nomeEmpresa,
  email,
  contato,
  produto,
}: {
  nomeEmpresa: string;
  email: string;
  contato: string;
  produto: string;
}) {
  const { user } = useAuth();
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [plataforma, setPlataforma] = useState('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Você precisa estar logado.');
    if (!data || !hora || !plataforma) {
      alert('Preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'reunioes'), {
        userId: user.uid,
        nomeEmpresa,
        email,
        contato,
        produto,
        data,
        hora,
        plataforma,
        criadoEm: serverTimestamp(),
      });
      setSucesso(true);
    } catch (err) {
      console.error('Erro ao salvar reunião:', err);
      alert('Erro ao salvar reunião.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Reunião agendada com sucesso!</h1>
        <p className="text-gray-600 text-center mb-6">
          Você será notificado por e-mail ou WhatsApp com os detalhes.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-red-900 text-white rounded-full hover:bg-red-800"
        >
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
      <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Agendar Reunião
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 font-semibold mb-1">Empresa</p>
          <p className="text-gray-600">{nomeEmpresa}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Plataforma</label>
          <select
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="zoom">Zoom</option>
            <option value="google-meet">Google Meet</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-900 font-semibold text-white py-2 rounded-full hover:bg-red-800 transition disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : 'Confirmar agendamento'}
        </button>
      </form>
    </div>
  );
}