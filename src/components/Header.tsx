'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { FaChevronDown } from 'react-icons/fa';
import { app } from '@/lib/firebaseConfig'; 
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { cartCount } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const auth = getAuth(app);

  // 🔥 Detecta usuário logado com Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Adiciona sombra ao rolar
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/cestas', label: 'Cestas' },
    { href: '/cartao', label: 'Cartão' },
    { href: '/carta', label: 'Carta de mensagem' },
    { href: '/item-supresa', label: 'Itens supresa' },
  ];

  return (
    <header
      className={`bg-red-900 text-white fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 10 ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex-shrink-0">
            <Image
              src="/images/logopc.svg"
              alt="Mimo Meu e Seu"
              width={120}
              height={60}
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline font-medium">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center space-x-3">
            <div className="relative hidden sm:flex items-center" ref={userMenuRef}>
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white shadow-sm">
                  <Image
                    src={user?.photoURL || 'https://www.gravatar.com/avatar/?d=mp&s=100'}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium px-1">
                  Olá, {user?.displayName?.split(' ')[0] || '@Visitante'}
                </span> 
                <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex rounded-lg items-center justify-center hover:bg-red-800 h-5 w-5 space-x-2 focus:outline-none"
              >
                <FaChevronDown className="text-white text-sm" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-0.5 mt-10 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/conta"
                    className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Minha conta
                  </Link>
                  <Link
                    href="/conta"
                    className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Afiliados
                  </Link>
                  <Link
                    href="/Parcerias"
                    className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Parcerias
                  </Link>
                  <Link
                    href="/conta"
                    className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Ser um influenciador
                  </Link>

                  <Link
                    href="/conta"
                    className="block px-4 py-2  border-b border-gray-300 text-sm hover:bg-red-50 hover:text-red-900"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Pessoas que amo
                  </Link>                 
                  {user ? (
                    <button
                      className="w-full text-left px-4  py-2 text-sm hover:bg-red-50 hover:text-red-900"
                      onClick={() => signOut(auth)}
                    >
                      Sair
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    >
                      Entrar
                    </Link>
                  )}
                </div>
              )}
            </div>

            

            {/* Botão Criar Cesta */}
            <Link 
            href="/criar-cestas"
            className="border border-white flex items-center justify-center gap-2 font-bold p-3  transition text-center text-white px-3  text-xs sm:text-sm font-medium rounded-full hover:bg-red-800 whitespace-nowrap">
              + Criar Cesta
            </Link>

            {/* Ícone do Carrinho */}
            <Link
              href="/carrinho"
              className=" border border-white rounded-full hover:bg-red-800 p-2 transition relative"
              aria-label="Carrinho"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h9"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-red-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* icone Menu Mobile */}
            <button
              className="md:hidden p-2 border border-white rounded-md text-white hover:bg-red-800 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 shadow-lg">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-900"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 ">
              <Link
                href="/conta"
                className="block px-3 py-2 rounded-md   border-gray-300 text-base font-medium text-gray-700 hover:bg-red-50 hover:text-red-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Minha conta
              </Link>
                  {user ? (
                    <button
                      className="w-full text-left px-4 border-t border-gray-300 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                      onClick={() => signOut(auth)}
                    >
                      Sair
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-900"
                    >
                      Entrar
                    </Link>
                  )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
