"use server";

import { cookies } from "next/headers";

export async function createSession(token: string) {
  const cookieStore = await cookies();
  
  // O token do Firebase dura 1 hora por padrão
  cookieStore.set("auth_token", token, {
    httpOnly: true, // Segurança: impede acesso via JS no cliente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // Coloque 7 dias aqui
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}