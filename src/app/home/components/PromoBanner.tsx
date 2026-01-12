'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function PromoBanner() {
  const [banners, setBanners] = useState<{imageUrl: string}[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(collection(db, 'banners')); // Você pode add: where('active', '==', true)
        const snapshot = await getDocs(q);
        const bannerList = snapshot.docs.map(doc => ({
          imageUrl: doc.data().imageUrl,
          ...doc.data()
        }));
        setBanners(bannerList);
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading || banners.length === 0) return <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-2xl mb-8" />;

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);

  return (
    <section className="relative w-full mb-8">
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[490px] xl:h-[510px] rounded-2xl overflow-hidden">
        <Image
          src={banners[currentSlide].imageUrl}
          alt="Promoção"
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Link href="/cestas" className="bg-white text-red-900 px-8 py-3 rounded-full font-semibold shadow-md hover:bg-gray-100">
            Compre Agora
          </Link>
        </div>
      </div>

      <div className="flex justify-between px-1 items-center mt-4">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full ${index === currentSlide ? "bg-red-800" : "bg-[#FCE1D0]"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prevSlide} className="p-1.5 rounded-full hover:bg-gray-200"><ChevronLeftIcon className="h-5 w-5" /></button>
          <button onClick={nextSlide} className="p-1.5 rounded-full hover:bg-gray-200"><ChevronRightIcon className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  );
}