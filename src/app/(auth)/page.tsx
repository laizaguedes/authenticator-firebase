"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <main className="h-screen bg-slate-50 flex items-center justify-center">
       {/* Um loader simples enquanto o redirecionamento não acontece */}
       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-600"></div>
    </main>
  );
}