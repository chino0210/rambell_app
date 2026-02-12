"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAutorAction(formData: FormData) {
  const nombreAutor = formData.get("nombre-autor");
  const imagenAutor = formData.get("imagen-autor");

  // Validación de nombre
  if (
    !nombreAutor ||
    typeof nombreAutor !== "string" ||
    nombreAutor.trim() === ""
  ) {
    return { error: "El nombre es obligatorio." };
  }

  // Validación de link de imagen (opcional)
  let imagePath: string | null = null;
  if (typeof imagenAutor === "string" && imagenAutor.trim() !== "") {
    try {
      new URL(imagenAutor); // Verifica que sea un link válido
      imagePath = imagenAutor;
    } catch {
      return { error: "El link de la imagen no es válido." };
    }
  }

  try {
    await prisma.autor.create({
      data: {
        name: nombreAutor.trim(),
        image: imagePath,
      },
    });

    revalidatePath("/"); // Actualiza la lista de autores donde sea que se muestre
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Error de base de datos al crear el autor." };
  }
}

export async function deleteAutorAction(id: number) {
  try {
    await prisma.autor.delete({
      where: { id },
    });
    revalidatePath("/"); // Refresca la lista automáticamente
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { error: "No se pudo eliminar el autor" };
  }
}

export async function updateAutorAction(id: number, formData: FormData) {
  const name = formData.get("nombre-autor") as string;
  const image = formData.get("imagen-autor") as string;

  if (!name || name.trim() === "") return { error: "El nombre es obligatorio" };

  try {
    await prisma.autor.update({
      where: { id },
      data: {
        name: name.trim(),
        image: image.trim() !== "" ? image : null,
      },
    });
    revalidatePath("/autores");
    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar el autor" };
  }
}
