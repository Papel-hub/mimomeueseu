'use client';

import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { app } from '@/lib/firebaseConfig'; 
import { FaSignOutAlt } from "react-icons/fa";


export default function HeaderCont() {
  const [user, setUser] = useState<User | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const auth = getAuth(app);

  // 🔥 Detecta usuário logado com Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // 🎯 Sombra ao rolar a página
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🚪 Logout do usuário
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-red-900 text-white transition-all duration-300 ${
        scrollY > 10 ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 🧭 Logo */}
          <Link href="/home" className="flex-shrink-0">
            <Image
              src="/images/logopc.svg"
              alt="Mimo Meu e Seu"
              width={120}
              height={60}
              priority
            />
          </Link>

          {/* ⚙️ Área do Usuário */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className=" sm:flex items-center space-x-3">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 gap-2 items-center rounded-md flex-row flex text-white bg-red-900 font-semibold hover:bg-red-800 transition"
                ><FaSignOutAlt size={20} />
                  Sair da conta
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className=" sm:inline-block px-3 py-1 rounded-md bg-white text-red-900 font-semibold hover:bg-gray-200 transition"
              >
                Entrar
              </Link>
            )}

            
          </div>
        </div>
      </div>

   
    </header>
  );
}
