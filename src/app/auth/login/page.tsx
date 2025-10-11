"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  AuthProvider, 
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const carouselImages = ["/images/1.svg", "/images/2.svg", "/images/3.svg"];

  // Auto-avanço do carrossel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

// Função genérica para login com provedor OAuth
const handleOAuthLogin = async (provider: AuthProvider, providerName: string) => {
  setError(null);
  setLoading(true);
  try {
    await signInWithPopup(auth, provider);
    router.push("/home");
  } catch (err) {
    const error = err as FirebaseError; 
    console.error(`Erro no login com ${providerName}:`, error);
    setError(`Falha ao entrar com ${providerName}. Tente novamente.`);
  } finally {
    setLoading(false);
  }
};

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/home");
  } catch (err) {
    const error = err as FirebaseError; 
    console.error("Erro no login:", error);
    let message = "Erro ao fazer login. Verifique suas credenciais.";
    if (error.code === "auth/user-not-found") {
      message = "Nenhuma conta encontrada com este e-mail.";
    } else if (error.code === "auth/wrong-password") {
      message = "Senha incorreta.";
    } else if (error.code === "auth/invalid-email") {
      message = "E-mail inválido.";
    }
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado esquerdo - Carrossel (somente em md+) */}
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
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-[#FCE1D0]" : "bg-white/60"
              } hover:bg-white`}
            />
          ))}
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white">
        <div className="max-w-md w-full mx-auto">

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Entre na sua conta</h1>
              <p className="text-gray-600 mt-1">
                Preencha os campos abaixo para acessar sua conta.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <Mail className="absolute  left-3.5 top-5 h-5 w-5 text-red-900" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-5 h-5 w-5 text-red-900" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-5 text-gray-500 hover:text-red-900 focus:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-red-900 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">Lembrar-me</span>
                </label>
                <Link href="/auth/login/forgot-password" className="text-red-900 hover:underline font-medium">
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-full font-semibold text-white transition ${
                  loading
                    ? "bg-red-700 cursor-not-allowed"
                    : "bg-red-900 hover:bg-red-800"
                } shadow-sm`}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">OU</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleOAuthLogin(new GoogleAuthProvider(), "Google")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Entrar com Google"
              >
                <Image src="/images/google-logo.png" alt="Google" width={24} height={24} />
              </button>
              <button
                onClick={() => handleOAuthLogin(new FacebookAuthProvider(), "Facebook")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Entrar com Facebook"
              >
                <Image src="/images/facebook.svg" alt="Facebook" width={24} height={24} />
              </button>
              <button
                onClick={() => handleOAuthLogin(new OAuthProvider("apple.com"), "Apple")}
                disabled={loading}
                className="flex items-center justify-center p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-60"
                aria-label="Entrar com Apple"
              >
                <Image src="/images/apple-50.png" alt="Apple" width={24} height={24} />
              </button>
            </div>

            <div className="text-center text-gray-600 text-sm mt-6">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-red-900 font-medium hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}