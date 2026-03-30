"use server";

import { actionWrapper } from "@/lib/action-wrapper";
import { ServerResponse } from "@/types/api";

type User = {
  externalAuthId: string;
  email: string;
  displayName: string;
  photoURL: string;
  authProvider: string;
}

type Result = {
  init: boolean;
  message: string;
  error: number;
};

interface UserProfile {
    id: string;
    name: string;
}

export async function syncUserAction(userData: User) {
  return actionWrapper(async () => {
    // TODO: criar chamada limpa usando o nosso utilitário fetch
    /*const data = await api<any>("/users/sync", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    
    return data as Result;
    */
   return { init: true, message: "", error: 0 } as Result;
  }, "SyncUser");
}

export const updateUser = async (user: any): Promise<ServerResponse<UserProfile>> => {
    return actionWrapper(async () => {
      return {
            message: "Sucesso ao atualizar",
            error: 200,
            data: { id: "1", name: "Teste" } as UserProfile
        };
    }, "UpdateUser");
}