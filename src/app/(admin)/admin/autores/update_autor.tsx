"use client";

import { useState } from "react";
import { updateAutorAction } from "./autores_action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X, Check } from "lucide-react";

export function UpdateAutor({ autor }: { autor: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    setLoading(true);
    const result = await updateAutorAction(autor.id, formData);
    setLoading(false);

    if (result?.success) {
      setIsEditing(false);
    } else if (result?.error) {
      alert(result.error);
    }
  }

  if (!isEditing) {
    return (
      <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
        <Pencil className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <form action={handleUpdate} className="flex items-center gap-2 bg-muted p-2 rounded-md">
      <Input
        name="nombre-autor"
        defaultValue={autor.name}
        placeholder="Nombre"
        className="h-8 w-37.5"
        required
      />
      <Input
        name="imagen-autor"
        defaultValue={autor.image || ""}
        placeholder="URL Imagen"
        className="h-8 w-37.5"
      />
      <Button size="icon" variant="ghost" type="submit" disabled={loading} className="text-green-600">
        <Check className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" type="button" onClick={() => setIsEditing(false)} className="text-red-600">
        <X className="h-4 w-4" />
      </Button>
    </form>
  );
}