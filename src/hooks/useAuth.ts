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
  registerWithEmail
} from "@/services/authService"; // ajuste o caminho se necessário

export const useAuth = () => {
    const [socialError, setSocialError] = useState<string | null>(null);
    const router = useRouter();

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

    return {
        handleRegisterAction,
        handleLoginAction,
        handleGoogleLogin,
        handleMicrosoftLogin,
        handleFacebookLogin,
        socialError
    };
}