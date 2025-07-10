import { useNavigate } from "@remix-run/react";

export default function Index() {
  return (
    <main className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a mi app</h1>
      <p className="text-lg text-gray-700 mb-6">Por favor inicia sesión para continuar.</p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-2 rounded inline-block"
      >
        Iniciar sesión
      </a>
    </main>
  );
}