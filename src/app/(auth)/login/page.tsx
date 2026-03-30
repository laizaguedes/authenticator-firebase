"use client";

import z from "zod";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaFacebook } from "react-icons/fa";
import { useSubmitForm } from "@/hooks/useSubmitForm";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/layouts/Button";

const LoginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

type LoginData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { handleLoginAction, handleGoogleLogin, handleFacebookLogin, handleMicrosoftLogin, socialError } = useAuth();

  const {
    form,
    errors,
    pending,
    handleChange,
    handleSubmit,
  } = useSubmitForm<LoginData, any>({
    initialData: { email: '', password: '' },
    schema: LoginSchema,
    action: handleLoginAction,
  });

  return (
    <div className="min-h-screen flex flex-col">

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col bg-white md:bg-[#E0F9FA] md:items-center md:justify-center md:px-4 md:py-12">
        <div
          className="flex flex-col gap-6 px-6 pt-10 pb-8
                     md:bg-white md:rounded-2xl md:shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] md:w-full md:max-w-md md:px-8 md:py-10"
        >
          {/* Título */}
          <h1 className="text-3xl font-bold text-center text-[#1A1A1B]">
            Login
          </h1>

          {/* Login Social */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#F9F9F9] hover:bg-[#F0F0F0] transition-colors"
              aria-label="Logar com Google"
              title="Google"
            >
              <FcGoogle size={32} />
            </button>
            <button
              onClick={handleMicrosoftLogin}
              type="button"
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#F9F9F9] hover:bg-[#F0F0F0] transition-colors"
              aria-label="Logar com Microsoft"
              title="Microsoft Outlook"
            >
              <FaMicrosoft size={32} color="#0078D4" />
            </button>
            <button
              onClick={handleFacebookLogin}
              type="button"
              className="flex items-center justify-center w-16 h-16 rounded-xl bg-[#F9F9F9] hover:bg-[#F0F0F0] transition-colors"
              aria-label="Logar com Facebook"
              title="Facebook"
            >
              <FaFacebook size={32} color="#1877F2" />
            </button>
          </div>

          {/* Link Cadastro */}
          <p className="text-center text-sm text-[#5A5A5A]">
            Não possui uma conta?{" "}
            <Link
              href="/signup"
              className="text-[#13C1C5] font-bold hover:text-[#0E8A8D] transition-colors"
            >
              Cadastre-se
            </Link>
          </p>

          {/* Erros gerais */}
          {(socialError || errors.form) && (
            <p className="text-red-500 text-sm text-center">
              {socialError || errors.form}
            </p>
          )}

          {/* Formulário */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* E-mail */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-[#1A1A1B]"
              >
                Email
              </label>
              <input
                autoFocus
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-[#D9D9D9] bg-white text-[#1A1A1B] text-sm outline-none focus:border-[#13C1C5] transition-all"
                disabled={pending}
                placeholder="Digite seu e-mail..."
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[#1A1A1B]"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-[#D9D9D9] bg-white text-[#1A1A1B] text-sm outline-none focus:border-[#13C1C5] transition-all"
                  disabled={pending}
                  placeholder="Digite sua senha..."
                  style={{ boxShadow: "none" }}
                />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#13C1C5] transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <Button variant="cta" type="submit" className="w-full mt-2">
              {pending ? 'Entrando...' : 'Entrar na conta'}
            </Button>
          </form>

          {/* Link Esqueceu Senha */}
          <p className="text-center text-sm">
            <span className="text-[#5A5A5A]">Esqueceu a senha?</span>
            {" "}
            <Link
              href="#"
              className="text-[#13C1C5] font-bold hover:text-[#0E8A8D] transition-colors"
            >
              Clique aqui.
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="md:hidden bg-white text-center py-6 text-xs text-[#5A5A5A]">
        footer
      </footer>
    </div>
  );
}
