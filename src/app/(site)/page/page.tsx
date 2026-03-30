"use client";

import { deleteSession } from "@/actions/auth/session-action";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const router = useRouter();

  const handleLogout = () => {
    deleteSession();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-xl bg-white p-10 md:p-12 rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/70">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6 p-4 bg-cyan-50 rounded-full border border-cyan-100 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-10 h-10 text-cyan-600"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-950">
            Acesso <span className="text-cyan-600">Garantido</span>
          </h1>
          
          <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
            Se você está vendo esta tela, significa que sua autenticação foi verificada com sucesso.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Status da Sessão
          </p>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            Usuário Autenticado
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button 
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition duration-150 text-sm flex items-center gap-2"
            onClick={handleLogout}
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sair do Sistema
          </button>
        </div>

      </main>
      
      <footer className="mt-12 text-center text-sm text-slate-400">
        <p>Projeto de Autenticação com Firebase & Next.js</p>
        <p>Desenvolvido por [Seu Nome]</p>
      </footer>

    </div>
  );
}