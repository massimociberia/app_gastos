import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Ingresar",
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Gastos</h1>
          <p className="mt-2 text-sm opacity-70">
            Ingresá tu email y te mandamos un link para entrar. Sin contraseña.
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
