"use client";

import { deleteTagAction, updateTagAction } from "./etiquetas_action";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TagList({ tags }: { tags: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (confirm("¿Eliminar etiqueta?")) {
      await deleteTagAction(id);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-2 p-2 border rounded-full px-4 bg-white shadow-sm"
          style={{ borderLeft: `6px solid ${tag.color}` }}
        >
          {editingId === tag.id ? (
            <form
              action={async (fd) => {
                await updateTagAction(tag.id, fd);
                setEditingId(null);
              }}
              className="flex items-center gap-2"
            >
              <Input
                name="nombre-tag"
                defaultValue={tag.name}
                className="h-7 w-24"
              />
              <Input
                name="color-tag"
                type="color"
                defaultValue={tag.color}
                className="w-8 h-7 p-0"
              />
              <Input
                name="code-name-tag"
                defaultValue={tag.code_name}
                className="h-7 w-16"
                placeholder="código"
              />
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => setEditingId(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              <span className="font-medium">{tag.name} ({tag.code_name})</span>
              <button
                onClick={() => setEditingId(tag.id)}
                className="text-gray-400 hover:text-blue-500"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleDelete(tag.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
