"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTagAction } from "./etiquetas_action"

export function CreateTag() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleAction(formData: FormData) {
    const result = await createTagAction(formData);
    if (result.success) {
      setStatus("success");
      formRef.current?.reset();
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
    }
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="flex gap-2 items-end border p-4 rounded-lg"
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium">Nombre</label>
        <Input name="nombre-tag" placeholder="Ej: Dereecho Penal. Derecho Civil" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Color</label>
        <Input
          name="color-tag"
          type="color"
          className="w-16 h-10 p-1"
          defaultValue="#3b82f6"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Código</label>
        <Input name="code-name-tag" placeholder="Ej: penal, civil" required />
      </div>
      <Button
        type="submit"
        className={status === "success" ? "bg-green-600" : ""}
      >
        {status === "success" ? "Etiqueta creada" : "Añadir Tag"}
      </Button>
    </form>
  );
}
