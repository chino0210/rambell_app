import prisma from "@/lib/prisma";
import Autores from "./autores";
import { CreateAutor } from "./create_autor";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  // Validación de seguridad doble
  if (session?.user?.role !== "ADMIN") {
    redirect("/escrito");
  }
  // Obtenemos los autores directamente en el servidor
  const autores = await prisma.autor.findMany({
    orderBy: { id: "desc" }, // Los más nuevos primero
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">AUTORES</h1>
        {/* Pasamos los datos como props */}
        <Autores listaAutores={autores} />
      </div>

      <div className="w-full max-w-md h-px bg-border" />

      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Crear nuevo autor
        </h2>
        <CreateAutor />
      </div>
    </div>
  );
}
