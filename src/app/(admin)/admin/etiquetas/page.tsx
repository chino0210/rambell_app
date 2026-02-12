import prisma from "@/lib/prisma";
import TagList from "./etiquetas";
import { CreateTag } from "./create_etiqueta"
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function TagsPage() {
  const session = await auth();

  // Validación de seguridad doble
  if (session?.user?.role !== "ADMIN") {
    redirect("/escrito");
  }
  const tags = await prisma.tag.findMany();

  return (
    <div className="flex flex-col items-center p-10 gap-8">
      <h1 className="text-2xl font-bold">GESTIÓN DE ETIQUETAS</h1>

      <TagList tags={tags} />

      <div className="w-full max-w-md">
        <h3 className="text-center mb-4 text-muted-foreground">
          Crear nueva etiqueta
        </h3>
        <CreateTag />
      </div>
    </div>
  );
}
