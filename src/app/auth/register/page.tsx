"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  AuthProvider, // ✅ adicione este
} from "firebase/auth";
import { FirebaseError } from "firebase/app"; // ✅ tipo correto do erro

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter();
  const carouselImages = ["/images/1.svg", "/images/2.svg", "/images/3.svg"];

  // Carrossel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Função de registro com e-mail/senha
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (password !== confirmPassword) {
    setError("As senhas não coincidem.");
    return;
  }

  if (password.length < 6) {
    setError("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

  setLoading(true);

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    router.push("/home");
  } catch (err) {
    const error = err as FirebaseError; // ✅ sem "any"
    console.error("Erro no registro:", error);
    let message = "Não foi possível criar sua conta. Tente novamente.";

    if (error.code === "auth/email-already-in-use") {
      message = "Este e-mail já está cadastrado.";
    } else if (error.code === "auth/invalid-email") {
      message = "Endereço de e-mail inválido.";
    } else if (error.code === "auth/weak-password") {
      message = "A senha é muito fraca. Use pelo menos 6 caracteres.";
    }

    setError(message);
  } finally {
    setLoading(false);
  }
};

  // Função genérica para login com OAuth (reutilizável)
const handleOAuthRegister = async (provider: AuthProvider, name: string) => {
  setError(null);
  setLoading(true);
  try {
    await signInWithPopup(auth, provider);
    router.push("/home");
  } catch (err) {
    const error = err as FirebaseError; // ✅ sem "any"
    console.error(`Erro no login com ${name}:`, error);
    setError(`Falha ao registrar com ${name}. Tente novamente.`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado esquerdo - Carrossel (somente em telas médias+) */}
      <div className="hidden md:flex md:w-1/2 bg-red-900 flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <Image
            src="/images/logopc.svg"
            alt="Mimo Meu e Seu"
            width={180}
            height={60}
            priority
          />
        </div>

        {/* Carrossel de imagens */}
        <div className="relative w-3/4 max-w-xs aspect-square rounded-full overflow-hidden shadow-xl mt-12">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              role="tabpanel"
              aria-hidden={index !== currentSlide}
            >
              <Image
                src={img}
                alt={`Imagem ilustrativa ${index + 1}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        {/* Indicadores do carrossel */}
        <div className="absolute bottom-8 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              className={`h-3 w-3 rounded-full ${
                index === currentSlide ? "bg-[#FCE1D0]" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Crie sua conta</h1>
              <p className="text-gray-600">
                Preencha os campos abaixo para criar uma conta
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Telefone (opcional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-5 text-gray-500 hover:text-red-900"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-5 text-gray-500 hover:text-red-900"
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-full font-semibold text-white transition ${
                  loading ? "bg-red-700 cursor-not-allowed" : "bg-red-900 hover:bg-red-800"
                } shadow-sm`}
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            {/* Divisor */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">OU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Login com redes sociais */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleOAuthRegister(new GoogleAuthProvider(), "Google")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Cadastrar com Google"
              >
                <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
              </button>
              <button
                onClick={() => handleOAuthRegister(new FacebookAuthProvider(), "Facebook")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Cadastrar com Facebook"
              >
                <Image src="/images/facebook-new.png" alt="Facebook" width={24} height={24} />
              </button>
              <button
                onClick={() => handleOAuthRegister(new OAuthProvider("apple.com"), "Apple")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Cadastrar com Apple"
              >
                <Image src="/images/apple-50.png" alt="Apple" width={24} height={24} />
              </button>
            </div>

            {/* Link para login */}
            <div className="text-center text-gray-600 text-sm mt-6">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-red-900 font-medium hover:underline">
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}