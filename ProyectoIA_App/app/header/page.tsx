'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${scrolling ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold text-blue-600 hover:opacity-80">
             Redes Neuronales Punto Control #3
          </span>
        </Link>
        <nav className="space-x-4 text-sm text-gray-600 font-medium">
          {/* Puedes agregar más enlaces aquí si haces crecer la app */}
          <Link href="/">
            <span className="hover:text-blue-500"></span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
