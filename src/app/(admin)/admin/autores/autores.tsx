"use client";

import { deleteAutorAction } from "./autores_action";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Icono de papelera
import Image from "next/image";
import { UpdateAutor } from "./update_autor";

export default function Autores({ listaAutores }: { listaAutores: any[] }) {
  async function handleDelete(id: number) {
    const confirmar = confirm(
      "¿Estás seguro de que quieres eliminar este autor?",
    );

    if (confirmar) {
      const result = await deleteAutorAction(id);
      if (result?.error) {
        alert(result.error);
      }
      // No necesitas hacer nada más, revalidatePath en la action
      // actualizará la lista automáticamente.
    }
  }
  return (
    <div className="grid gap-4 w-full">
      {listaAutores.map((autor) => (
        <div
          key={autor.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            <Image
              src={autor.image || "https://via.placeholder.com/40"}
              alt={autor.name}
              className="w-10 h-10 rounded-full object-cover"
              width={10}
              height={10}
            />
            <span className="font-medium">{autor.name}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* COMPONENTE DE ACTUALIZACIÓN */}
            <UpdateAutor autor={autor} />

            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(autor.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
