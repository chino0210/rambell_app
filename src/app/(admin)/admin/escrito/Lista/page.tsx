// src/app/(admin)/escrito/dashboard/page.tsx
import prisma from "@/lib/prisma";
import ListaEscritos from "./listaEscritos"; // Un componente aparte
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // Validación de seguridad doble
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }
  // Traemos los datos de forma segura en el servidor
  const escritos = await prisma.escrito.findMany({
    include: {
      autor: true,
      tags: true,
    },
  });

  return (
    <div className="p-6">
      {/* Añadir boton de Crear articulo, modificiar autores y etiquetas. */}
      <h1 className="text-2xl font-bold mb-4">Administrar Escritos</h1>
      {/* Pasamos los datos al componente de cliente */}
      <ListaEscritos iniciales={escritos} currentPage={1} totalPages={1} totalItems={escritos.length} />
    </div>
  );
}