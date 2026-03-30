import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function actionWrapper<T>(
  action: () => Promise<T>, 
  contextName?: string
): Promise<T> {
  try {
    return await action();
  } catch (error: any) {
    // 1. Deixa os redirects do Next.js passarem (forma mais segura)
    if (isRedirectError(error)) {
      throw error;
    }

    // 2. Extração amigável de status
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    // 3. Tratamento de Autenticação/Autorização
    // 401: Token expirado/inválido | 403: Sem permissão
    if (status === 401 || status === 403 || errorMessage === "NEXT_REDIRECT_TO_LOGIN") {
      console.warn(`[Auth Redirect] ${contextName || 'Action'}: Redirecionando para login.`);
      redirect("/login");
    }

    // 4. Log centralizado com contexto (útil para Debug no servidor)
    console.error(`[Action Error] ${contextName || 'General'}:`, {
      message: errorMessage,
      status: status,
      stack: error.stack
    });

    // Relança para que o componente (ou useSubmitForm) receba o erro
    throw error;
  }
}