"use client";

import z from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSubmitForm } from "@/hooks/useSubmitForm";
import Button from "@/components/layouts/Button";

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
});

type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { handleResetPassword } = useAuth();
  const { form, errors, pending, result, handleChange, handleSubmit } =
    useSubmitForm<ForgotPasswordData, any>({
      initialData: { email: '' },
      schema: ForgotPasswordSchema,
      action: handleResetPassword,
    });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col bg-white md:bg-[#E0F9FA] md:items-center md:justify-center md:px-4 md:py-12">
        <div className="flex flex-col gap-6 px-6 pt-10 pb-8 md:bg-white md:rounded-2xl md:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] md:w-full md:max-w-md md:px-8 md:py-10">
          {result !== undefined ? (
            <div className="flex flex-col gap-6 text-center">
              <div>
                <h1 className="text-2xl font-bold text-[#1A1A1B]">E-mail enviado!</h1>
                <p className="text-[#5A5A5A] text-sm mt-2">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
              <p className="text-sm text-center">
                <Link href="/login" className="text-[#13C1C5] font-bold hover:text-[#0E8A8D] transition-colors">
                  Voltar para o login
                </Link>
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#1A1A1B]">Recuperar senha</h1>
                <p className="text-[#5A5A5A] text-sm mt-1">
                  Informe seu e-mail para receber o link de redefinição
                </p>
              </div>
              {errors.form && (
                <p className="text-red-500 text-sm text-center">{errors.form}</p>
              )}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-[#1A1A1B]">E-mail</label>
                  <input
                    autoFocus
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#D9D9D9] bg-white text-[#1A1A1B] text-sm outline-none focus:border-[#13C1C5] transition-all"
                    disabled={pending}
                    placeholder="Digite seu e-mail..."
                  />
                  {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>
                <Button variant="cta" type="submit" className="w-full mt-2">
                  {pending ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </form>
              <p className="text-center text-sm">
                <span className="text-[#5A5A5A]">Lembrou a senha?</span>{" "}
                <Link href="/login" className="text-[#13C1C5] font-bold hover:text-[#0E8A8D] transition-colors">
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
