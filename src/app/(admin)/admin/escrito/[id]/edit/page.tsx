// src/app/(admin)/admin/escrito/[id]/edit/page.tsx
import { auth } from "@/app/actions/auth";
import { redirect, notFound } from "next/navigation";

import UpdateForm from "./update_form";
import prisma from "@/lib/prisma";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  // 1. Buscamos el escrito
  const escrito = await prisma.escrito.findUnique({
    where: { id },
    include: { tags: true },
  });

  const todasLasEtiquetas = await prisma.tag.findMany();

  const todosLosAutores = await prisma.autor.findMany();

  if (!escrito) notFound();

  return (
    <UpdateForm
      escrito={escrito}
      etiquetasDisponibles={todasLasEtiquetas} // <-- Asegúrate de pasar esto
      autores={todosLosAutores} // <-- Y esto
    />
  );
}
