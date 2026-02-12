"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from "next/dynamic";
import { CheckCircle2, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { updateEscritoAction } from "../../escrito-actions";

// Tipado para los datos iniciales que vienen de la DB
interface EscritoInitialData {
  id: string;
  titulo_escrito: string;
  resumen: string;
  autorId: number;
  contenido: any;
  link_documento?: string | null;
  link_imagen?: string | null;
  status: string;
  // Cambia esta línea para que acepte que tags puede no venir
  tags?: { name: string }[];
}

const EditorField = dynamic(
  () => import("../../crear/editor").then((mod) => mod.EditorField),
  {
    ssr: false,
    loading: () => (
      <div className="h-75 w-full bg-muted/50 animate-pulse rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
        Cargando editor...
      </div>
    ),
  },
);

const FormSchema = z.object({
  titulo_escrito: z.string().min(1, "El título es requerido").trim(),
  resumen: z
    .string()
    .min(1, "El resumen es requerido")
    .max(140, "Máximo 140 caracteres"),
  autor: z.string().min(1, "Selecciona un autor"),
  etiquetas: z.array(z.string()).min(1, "Selecciona al menos una etiqueta"),
  contenido: z
    .array(z.any())
    .refine((val) => val.length > 0, "El contenido no puede estar vacío"),
  link_documento: z.string().trim().url("URL inválida").or(z.literal("")),
  link_imagen: z.string().trim().url("URL inválida").or(z.literal("")),
  publicar: z.boolean(),
});

type FormValues = z.infer<typeof FormSchema>;

export function UpdateForm({
  autores,
  etiquetasDisponibles,
  escrito, // El registro que vamos a editar
}: {
  autores: any[];
  etiquetasDisponibles: any[];
  escrito: EscritoInitialData;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      titulo_escrito: escrito.titulo_escrito,
      resumen: escrito.resumen,
      autor: escrito.autorId.toString(),

      // CAMBIO AQUÍ: Añadimos ?. y || []
      etiquetas: escrito.tags?.map((t) => t.name) || [],

      contenido: escrito.contenido,
      link_documento: escrito.link_documento || "",
      link_imagen: escrito.link_imagen || "",
      publicar: escrito.status === "PUBLICADO",
    },
  });

  const currentResumen = watch("resumen") || "";
  const currentEtiquetas = watch("etiquetas") || [];

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateEscritoAction(escrito.id, data);

      if (result?.error) throw new Error(result.error);

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un error al actualizar el artículo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-3xl font-extrabold tracking-tight">
              Editar Artículo
            </FieldLegend>

            <FieldGroup className="mt-8 space-y-6">
              {/* TÍTULO */}
              <Field>
                <FieldLabel className="text-sm font-semibold">
                  Título del escrito
                </FieldLabel>
                <Input
                  {...register("titulo_escrito")}
                  className={errors.titulo_escrito ? "border-destructive" : ""}
                />
                <ErrorDisplay message={errors.titulo_escrito?.message} />
              </Field>

              {/* RESUMEN */}
              <Field>
                <div className="flex justify-between items-center mb-1">
                  <FieldLabel className="text-sm font-semibold">
                    Resumen breve
                  </FieldLabel>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${currentResumen.length > 140 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                  >
                    {currentResumen.length} / 140
                  </span>
                </div>
                <Textarea
                  {...register("resumen")}
                  rows={3}
                  className={
                    errors.resumen ? "border-destructive" : "resize-none"
                  }
                />
                <ErrorDisplay message={errors.resumen?.message} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AUTOR */}
                <Field>
                  <FieldLabel className="text-sm font-semibold">
                    Autor
                  </FieldLabel>
                  <Controller
                    name="autor"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un autor" />
                        </SelectTrigger>
                        <SelectContent>
                          {autores.map((a) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              {a.nombre || a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <ErrorDisplay message={errors.autor?.message} />
                </Field>

                {/* ETIQUETAS */}
                <Field>
                  <FieldLabel className="text-sm font-semibold">
                    Etiquetas
                  </FieldLabel>
                  <Select
                    onValueChange={(value) => {
                      if (!currentEtiquetas.includes(value)) {
                        setValue("etiquetas", [...currentEtiquetas, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Añadir etiquetas" />
                    </SelectTrigger>
                    <SelectContent>
                      {etiquetasDisponibles.map((tag) => (
                        <SelectItem key={tag.id} value={tag.name}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentEtiquetas.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setValue(
                              "etiquetas",
                              currentEtiquetas.filter((t) => t !== tag),
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <ErrorDisplay message={errors.etiquetas?.message} />
                </Field>
              </div>

              {/* CONTENIDO (EDITOR) */}
              <Field>
                <FieldLabel className="text-sm font-semibold mb-2 block">
                  Contenido del Artículo
                </FieldLabel>
                <Controller
                  name="contenido"
                  control={control}
                  render={({ field }) => (
                    <div
                      className={`min-h-75 rounded-lg overflow-hidden border-2 ${errors.contenido ? "border-destructive" : "border-input"}`}
                    >
                      <EditorField
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <ErrorDisplay message={errors.contenido?.message} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field>
                  <FieldLabel className="text-sm font-semibold">
                    Link Documento
                  </FieldLabel>
                  <Input
                    {...register("link_documento")}
                    placeholder="https://..."
                  />
                  <ErrorDisplay message={errors.link_documento?.message} />
                </Field>
                <Field>
                  <FieldLabel className="text-sm font-semibold">
                    Link Imagen
                  </FieldLabel>
                  <Input
                    {...register("link_imagen")}
                    placeholder="https://..."
                  />
                  <ErrorDisplay message={errors.link_imagen?.message} />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator className="my-10" />

          <div className="flex items-center justify-between p-6 border rounded-2xl bg-muted/20">
            <div className="space-y-1">
              <FieldLabel className="text-base font-bold">
                Estado de publicación
              </FieldLabel>
              <FieldDescription>
                ¿Hacer este artículo visible ahora?
              </FieldDescription>
            </div>
            <Controller
              name="publicar"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10">
            <Button
              type="submit"
              size="lg"
              className={`flex-2 h-12 text-base font-bold ${isSuccess ? "bg-green-600 hover:bg-green-700" : ""}`}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {isSuccess ? "¡Cambios Guardados!" : "Actualizar Artículo"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

const ErrorDisplay = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[13px] font-semibold text-destructive mt-2">{message}</p>
  ) : null;

export default UpdateForm;
