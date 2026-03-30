import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { ZodSchema } from "zod";

interface UseFormProps<TData, TResult> {
    initialData: TData;
    schema: ZodSchema<TData>;
    // TResult é o tipo que sua função de ação retorna (ex: { error: string, token: string })
    action: (data: TData) => Promise<TResult>;
}

type InputElements = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export const useSubmitForm = <TData extends object, TResult>({
    initialData,
    schema,
    action, // A função de envio (ação)
}: UseFormProps<TData, TResult>) => {

    // Estado do formulário e dos erros
    const [form, setForm] = useState<TData>(initialData);
    const [errors, setErrors] = useState<Record<keyof TData | 'form', string | undefined>>(
        {} as Record<keyof TData | 'form', string | undefined>
    );
    const [result, setResult] = useState<TResult | undefined>(undefined);

    // Estado de transição/carregamento
    const [pending, startTransition] = useTransition();

    // Função para lidar com a mudança nos campos de input
    const handleChange = (e: ChangeEvent<InputElements>) => {
        const { name, value } = e.target;

        // Atualiza o estado do formulário
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));

        // Limpa o erro do campo atual e do formulário geral
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined,
            form: undefined
        } as any));
    };

    // Função principal para lidar com o envio do formulário
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const result = schema.safeParse(form);

        // 1. Tratamento de Erros de Validação (Zod)
        if (!result.success) {
            const fieldErrors: Record<keyof TData | 'form', string | undefined> = {} as any;

            result.error.issues.forEach((err: any) => {
                // 2. Garante que o caminho é o nome do campo (uma string)
                const fieldName = err.path[0];

                if (typeof fieldName === 'string') {
                    // 3. Associa o erro ao campo correspondente
                    fieldErrors[fieldName as keyof TData | 'form'] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        startTransition(async () => {
            const res = await action(result.data); // Executa a ação genérica (ex: login)

            if (res && (res as any).error) {
                setErrors({ form: (res as any).error } as any);
            } else {
                setResult(res);
            }
        });
    };

    return {
        form,
        setForm,
        errors,
        pending,
        result, // 💡 O componente pode observar este valor
        handleChange,
        handleSubmit,
        setErrors
    };
};