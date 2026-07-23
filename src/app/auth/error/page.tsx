import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string }>;
}) {
  const { motivo } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold">No pudimos iniciar sesión</h1>
        <p className="mt-3 text-sm opacity-70">
          {motivo ?? "El link puede haber expirado o ya haber sido usado."}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background"
        >
          Probar de nuevo
        </Link>
      </div>
    </main>
  );
}
