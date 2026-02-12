// page.tsx
import prisma from "@/lib/prisma";
import EscritoPage from "./escrito";
import { EscritoSidebar } from "./bara-lateral"; // Importa el nuevo componente
import { notFound } from "next/navigation";
import { auth } from "@/app/actions/auth";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  const escrito = await prisma.escrito.findUnique({
    where: { id },
    include: {
      autor: true,
      tags: true,
    },
  });

  if (!escrito) notFound();

  // Incrementar vistas usando la API route para manejar cookies
  await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/views/${id}`, {
    method: 'GET',
  });

  // Verificar si el usuario ya ha guardado este escrito
  let initialIsGuardado = false;
  if (userId) {
    const guardadoExistente = await prisma.guardado.findUnique({
      where: {
        userId_escritoId: { userId, escritoId: id },
      },
    });
    initialIsGuardado = !!guardadoExistente;
  }

  return (
    <main className="container mx-auto py-15">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lado Izquierdo: El escrito */}
        <div className="lg:col-span-2">
          <EscritoPage
            titulo={escrito.titulo_escrito}
            contenido={escrito.contenido}
            autorNombre={escrito.autor?.name || "Anónimo"}
          />
        </div>

        {/* Lado Derecho: La barra lateral separada */}
        <div className="lg:col-span-1">
          <EscritoSidebar
            fecha={escrito.createdAt.toISOString()}
            guardados={escrito.numero_guardados}
            tags={escrito.tags}
            idDocumento={escrito.id}
            initialIsGuardado={initialIsGuardado}
          />
        </div>
      </div>
    </main>
  );
}
