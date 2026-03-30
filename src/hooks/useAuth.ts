import { createSession } from "@/actions/auth/session-action";
import { syncUserAction } from "@/actions/auth/user-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginData, RegisterData } from "../types/register-data";

import {
  loginWithGoogle,
  loginWithFacebook,
  loginWithOutlook,
  loginWithEmail,
  getAuthErrorMessage,
  registerWithEmail,
  resetPassword
} from "@/services/authService"; // ajuste o caminho se necessário
import { useToast } from "@/components/layouts/toast";

export const useAuth = () => {
    const [socialError, setSocialError] = useState<string | null>(null);
    const router = useRouter();
    const { addToast } = useToast();

    //register
    const handleRegisterAction = async (data: RegisterData): Promise<any> => {
        try {
            const { externalAuthId, email, displayName, photoURL, authProvider, token } = await registerWithEmail(data.email, data.password);

            // 1. Salva o token no Cookie (para o apiFetch/Axios usar no servidor)
            await createSession(token);

            // 2. Sincroniza com o Java/PostgreSQL
            const result = await syncUserAction({
                externalAuthId: externalAuthId,
                email: email!,
                displayName: displayName || "Usuário",
                photoURL: photoURL || "",
                authProvider: authProvider,
            });

            router.push("/page");
        } catch (error: any) {
            const message = getAuthErrorMessage(error.code);
            return { error: message };
        }
    }

    //login
    const handleLoginAction = async (data: LoginData): Promise<any> => {
        try {
            const { externalAuthId, email, displayName, photoURL, authProvider, token } = await loginWithEmail(data.email, data.password);

            // 1. Salva o token no Cookie (para o apiFetch/Axios usar no servidor)
            await createSession(token);

            // 2. Sincroniza com o Java/PostgreSQL
            const result = await syncUserAction({
                externalAuthId: externalAuthId,
                email: email!,
                displayName: displayName || "Usuário",
                photoURL: photoURL || "",
                authProvider: authProvider,
            });

            router.push("/page");
        } catch (error: any) {
            const message = getAuthErrorMessage(error.code);
            return { error: message };
        }
    }

    const handleSocialLogin = async (loginFn: () => Promise<any>) => {
        setSocialError(null);
        try {
            const { externalAuthId, email, displayName, photoURL, authProvider, token } = await loginFn();

            // 1. Salva o token no Cookie (para o apiFetch/Axios usar no servidor)
            await createSession(token);

            // 2. Sincroniza com o Java/PostgreSQL
            const result = await syncUserAction({
                externalAuthId: externalAuthId,
                email: email!,
                displayName: displayName || "Usuário",
                photoURL: photoURL || "",
                authProvider: authProvider,
            });

            router.push("/page");
        } catch (error: any) {
            setSocialError(getAuthErrorMessage(error.code));
        }
    };
    
    const handleGoogleLogin = () => handleSocialLogin(loginWithGoogle);
    const handleMicrosoftLogin = () => handleSocialLogin(loginWithOutlook);
    const handleFacebookLogin = () => handleSocialLogin(loginWithFacebook);

    const handleResetPassword = async (data: { email: string }): Promise<any> => {
        try {
            await resetPassword(data.email);
            addToast('E-mail de recuperação enviado! Verifique sua caixa de entrada.', 'success');
            return {};
        } catch (error: any) {
            const message = getAuthErrorMessage(error.code);
            return { error: message };
        }
    };

    return {
        handleRegisterAction,
        handleLoginAction,
        handleGoogleLogin,
        handleMicrosoftLogin,
        handleFacebookLogin,
        handleResetPassword,
        socialError
    };
}