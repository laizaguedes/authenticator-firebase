import { useToast } from "@/components/layouts/toast";

// Tipagem do que o seu banco/servidor Java sempre envia
interface ServerResponse<T> {
    message: string;
    error: number;
    data: T;
}

/**
 * @param action - A Server Action que será disparada
 * @param params - Os dados que a action recebe (ex: formData ou objeto)
 * @returns Os dados limpos para a page.tsx ou null em caso de erro
 */
export async function handleAction<T, R>(
    action: (params: T) => Promise<ServerResponse<R>>,
    params: T
): Promise<R | null> {
    const toast = useToast();
    try {
        const result = await action(params);
        
        // Validação centralizada do padrão do seu banco
        if (result.error !== 200) {
            // Se deu erro no banco/negócio, mostra a mensagem que veio de lá
            toast.addToast(result.message || "Erro ao processar solicitação.", "error");
            return null;
        }

        // Se chegou aqui, é sucesso (200)
        if (result.message) {
            toast.addToast(result.message, "success");
        }

        return result.data; // Retorna apenas o que a page.tsx precisa

    } catch (error: any) {
        // Erros críticos de rede ou crash no servidor
        console.error("Erro crítico na Action:", error);
        toast.addToast("Falha na comunicação com o servidor.", "error");
        return null;
    }
}