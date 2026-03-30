import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, facebookProvider, outlookProvider } from "../lib/firebase";
import { deleteSession } from "@/actions/auth/session-action";

// No topo do authService.ts
export type AuthUser = {
  externalAuthId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  token: string;
  authProvider: string;
}

// Função auxiliar para padronizar o retorno
const mapFirebaseUser = async (user: any, provider: string): Promise<AuthUser> => {
  return {
    externalAuthId: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    token: await user.getIdToken(),
    authProvider: provider, // Ex: FIREBASE_GOOGLE
  };
};

// 1. Defina o objeto com as traduções
const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found': 'Este e-mail não está cadastrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'Dados de acesso inválidos.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
};

// 2. Crie a função que traduz o código vindo do Firebase
export const getAuthErrorMessage = (code: string): string => {
  return FIREBASE_ERRORS[code] || 'Ocorreu um erro inesperado. Tente novamente.';
};

// Logins Sociais
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider).then(res => mapFirebaseUser(res.user, 'FIREBASE_GOOGLE'));;
export const loginWithFacebook = () => signInWithPopup(auth, facebookProvider).then(res => mapFirebaseUser(res.user, 'FIREBASE_FACEBOOK'));;
export const loginWithOutlook = () => signInWithPopup(auth, outlookProvider).then(res => mapFirebaseUser(res.user, 'FIREBASE_OUTLOOK'));;

// Login Tradicional (E-mail e Senha)
export const registerWithEmail = (email:string, password:string) => 
  createUserWithEmailAndPassword(auth, email, password).then(res => mapFirebaseUser(res.user, 'FIREBASE_EMAIL'));;

export const loginWithEmail = (email:string, password:string) => 
  signInWithEmailAndPassword(auth, email, password).then(res => mapFirebaseUser(res.user, 'FIREBASE_EMAIL'));;

export const logout = async () => {
  await signOut(auth);
  await deleteSession(); // Limpa o cookie no servidor
};