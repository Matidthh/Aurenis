"use client";

import { LogIn, Search, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function InstitutionLoginSection() {
  const [schoolDomain, setSchoolDomain] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolDomain.trim()) {
      // En un entorno real, buscaría el colegio y redirigiría a /slug/login
      const slug = schoolDomain.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      router.push(`/${slug}/login`);
    }
  };

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden" id="login">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/30">
          <LogIn className="w-8 h-8 text-blue-400" />
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
          Ingresa al portal de tu institución
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Estudiantes, apoderados, docentes y directivos pueden acceder a su información académica en tiempo real, desde cualquier dispositivo.
        </p>

        <form onSubmit={handleLogin} className="max-w-xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={schoolDomain}
              onChange={(e) => setSchoolDomain(e.target.value)}
              className="block w-full pl-12 pr-32 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all text-lg"
              placeholder="Nombre o ID de tu colegio..."
            />
            <div className="absolute inset-y-2 right-2">
              <button
                type="submit"
                className="h-full px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 transition-colors"
              >
                <span>Entrar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Acceso seguro y cifrado de extremo a extremo.</span>
          </div>
        </form>
      </div>
    </section>
  );
}
