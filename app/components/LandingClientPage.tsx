import React from 'react';
import Link from 'next/link';

export default function LandingClientPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenidos a AURENIS</h1>
      <p className="text-lg mb-8 max-w-2xl">
        Plataforma Integral de Gestión Escolar y Académica.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Iniciar Sesión
        </Link>
        <Link href="/sobre-nosotros" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Sobre Nosotros
        </Link>
      </div>
    </div>
  );
}
