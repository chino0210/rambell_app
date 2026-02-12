import prisma from "@/lib/prisma";
import { CreateForm } from "./create_form";

import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function CreateEscritoPage() {
  const autores = await prisma.autor.findMany();
  // 1. Debes obtener las etiquetas aquí
  const etiquetas = await prisma.tag.findMany();

  const session = await auth();

  // Validación de seguridad doble
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <CreateForm
      autores={autores}
      etiquetasDisponibles={etiquetas} // 2. Pásalas como prop aquí
    />
  );
}
