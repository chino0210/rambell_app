"use server";

import prisma from "@/lib/prisma";
import { WriteStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createEscritoAction(data: any) {
  try {
    // 1. Decidir el status basado en el checkbox 'publicar'
    const statusValue = data.publicar
      ? WriteStatus.PUBLICADO
      : WriteStatus.BORRADOR;

    const nuevoEscrito = await prisma.escrito.create({
      data: {
        titulo_escrito: data.titulo_escrito,
        resumen: data.resumen,
        contenido: data.contenido,
        link_documento: data.link_documento || null,
        link_imagen: data.link_imagen || null,

        // Ajustado a tu modelo: se llama 'status', no 'publicado'
        status: statusValue,
        views: 0, // Inicializamos las vistas en 0
        numero_guardados: 0, // O lo que quieras poner por defecto

        // Conexión del Autor (ID es Int)
        autor: {
          connect: { id: parseInt(data.autor) },
        },

        // Etiquetas: Si recibes nombres, usa 'name'. Si recibes IDs, usa 'id'.
        // Según tu log recibes nombres: ["Derecho Judicial Xd"]
        tags: {
          connect: data.etiquetas.map((tagName: string) => ({
            name: tagName, // 👈 Cambia 'id' por 'name' si tus tags se identifican por nombre
          })),
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("ERROR REAL DE PRISMA:", error);
    return { error: "Error al guardar: " + error.message };
  }
}

export async function deleteEscritoAction(id: string) {
  try {
    await prisma.escrito.delete({
      where: { id: id },
    });

    // Esto refresca la lista automáticamente en la interfaz
    revalidatePath("/(admin)/escritos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { error: "No se pudo eliminar el artículo." };
  }
}

export async function updateEscritoAction(id: string, data: any) {
  try {
    const statusValue = data.publicar ? "PUBLICADO" : "BORRADOR";

    await prisma.escrito.update({
      where: { id },
      data: {
        titulo_escrito: data.titulo_escrito,
        resumen: data.resumen,
        contenido: data.contenido,
        link_documento: data.link_documento || null,
        link_imagen: data.link_imagen || null,
        status: statusValue,
        autor: { connect: { id: parseInt(data.autor) } },
        tags: {
          // Esto borra las conexiones viejas y pone las nuevas
          set: [],
          connect: data.etiquetas.map((name: string) => ({ name })),
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
