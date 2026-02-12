"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react"; // Opcional: un icono para el éxito
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createAutorAction } from "./autores_action";

function SubmitButton({ isSuccess }: { isSuccess: boolean }) {
  const { pending } = useFormStatus();

  // Si tuvo éxito, mostramos el botón verde
  if (isSuccess) {
    return (
      <Button
        type="button"
        className="bg-green-600 hover:bg-green-600 text-white gap-2"
      >
        <CheckCircle2 className="h-4 w-4" />
        Autor añadido
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={pending} className="min-w-30">
      {pending ? "Guardando..." : "Guardar Autor"}
    </Button>
  );
}

export function CreateAutor() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    const result = await createAutorAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      // Éxito
      setIsSuccess(true);
      formRef.current?.reset();

      // Revertir el botón a la normalidad tras 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form ref={formRef} action={handleAction}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-xl font-bold">Crear Autor</FieldLegend>
            <FieldDescription>
              Ingrese los datos. Solo se aceptan enlaces (URLs) para la imagen.
            </FieldDescription>

            <FieldSeparator className="mx-10" />

            <FieldGroup className="">
              <Field>
                <FieldLabel htmlFor="nombre-autor">Nombre del Autor</FieldLabel>
                <Input
                  id="nombre-autor"
                  name="nombre-autor"
                  placeholder="Ej: Gabriel García Márquez"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="imagen-autor">
                  Link de la Imagen (Opcional)
                </FieldLabel>
                <Input
                  id="imagen-autor"
                  name="imagen-autor"
                  type="url"
                  placeholder="https://ejemplo.com/autor.jpg"
                />
              </Field>

              {/* Mostrar error de validación si existe, sin usar alerts */}
              {error && (
                <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
              )}
            </FieldGroup>
          </FieldSet>

          <FieldSeparator className="mx-10" />

          <Field orientation="horizontal" className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="reset"
              onClick={() => {
                setIsSuccess(false);
                setError(null);
              }}
            >
              Limpiar
            </Button>
            <SubmitButton isSuccess={isSuccess} />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
