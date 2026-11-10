"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl p-10 space-y-5">
      <h1 className="text-2xl font-bold">
        No pudimos cargar esta información.
      </h1>
      <p>
        Revisa la configuración de Supabase y las migraciones, o utiliza la demo
        con npm run dev.
      </p>
      <button className="huellas-button" onClick={reset}>
        Volver a intentar
      </button>
    </div>
  );
}
