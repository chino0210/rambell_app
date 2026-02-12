import { redirect } from "next/navigation";
import { auth } from "@/app/actions/auth";

export default async function IniciarSesionPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión como Admin</h1>
      <p>Esta página está reservada para administradores.</p>
    </div>
  );
}
