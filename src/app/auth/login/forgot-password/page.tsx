"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/lib/firebaseConfig";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);
  setError(null);

  try {
    await sendPasswordResetEmail(auth, email.trim());
    setMessage(
      "Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada (e também a pasta de spam)."
    );
  } catch (err) {
    // ✅ TypeScript sabe que `err` é `unknown`, então faça uma verificação
    const error = err as FirebaseError; // 👈 tipagem segura
    console.error("Erro ao enviar e-mail de redefinição:", error);
    let errorMessage = "Não foi possível enviar o e-mail. Tente novamente.";

    if (error.code === "auth/invalid-email") {
      errorMessage = "Endereço de e-mail inválido.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "Se uma conta com este e-mail existir, você receberá um link.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
    }

    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Esqueceu sua senha?
        </h1>
        <p className="text-gray-600 mb-6">
          Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="exemplo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-md p-3"
              role="alert"
            >
              {message}
            </div>
          )}
          {error && (
            <div
              className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-md p-3"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-red-700 cursor-not-allowed opacity-90"
                : "bg-red-900 hover:bg-red-800 active:bg-red-950"
            } shadow-sm`}
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="mt-6 w-full text-sm text-red-700 hover:text-red-900 font-medium hover:underline transition"
          aria-label="Voltar para a página de login"
        >
          ← Voltar ao login
        </button>
      </div>
    </div>
  );
}