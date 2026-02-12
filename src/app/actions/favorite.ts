"use server";

import { auth } from "@/app/actions/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleGuardarEscrito(escritoId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Debes iniciar sesión" };
  }

  // Convertimos a número con seguridad
  const userId = parseInt(session.user.id);
  if (isNaN(userId)) return { error: "ID de usuario no válido" };

  // Verificar que el usuario existe
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "Usuario no encontrado" };

  try {
    const existente = await prisma.guardado.findUnique({
      where: {
        userId_escritoId: { userId, escritoId },
      },
    });

    if (existente) {
      // Si existe, lo borramos y restamos 1 al contador, además decrementamos views en 15
      await prisma.$transaction([
        prisma.guardado.delete({ where: { id: existente.id } }),
        prisma.escrito.update({
          where: { id: escritoId },
          data: { numero_guardados: { decrement: 1 } },
        }),
        prisma.escrito.update({
          where: { id: escritoId },
          data: { views: { decrement: 15 } },
        }),
      ]);
    } else {
      // Si no existe, lo creamos y sumamos 1 al contador, además incrementamos views en 15
      await prisma.$transaction([
        prisma.guardado.create({ data: { userId, escritoId } }),
        prisma.escrito.update({
          where: { id: escritoId },
          data: { numero_guardados: { increment: 1 } },
        }),
        prisma.escrito.update({
          where: { id: escritoId },
          data: { views: { increment: 15 } },
        }),
      ]);
    }

    // REVALIDACIÓN CRUCIAL:
    // Revalida la página actual para que el número de "guardados" suba o baje al instante
    revalidatePath(`/escrito/${escritoId}`);
    revalidatePath("/cuenta");

    return { success: true, estado: existente ? "eliminado" : "guardado" };
  } catch (error) {
    console.error("Error en toggleGuardarEscrito:", error);
    return { error: "Error en la base de datos" };
  }
}
