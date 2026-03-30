import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se o status for 401 ou 403, lançamos o erro que o actionWrapper já conhece
  if (response.status === 401 || response.status === 403) {
    throw new Error("NEXT_REDIRECT_TO_LOGIN");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || "Erro na requisição ao servidor Java",
    };
  }

  // O fetch não converte para JSON automaticamente como o Axios, precisamos fazer aqui
  return response.json();
}