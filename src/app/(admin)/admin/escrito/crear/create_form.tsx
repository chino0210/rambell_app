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
// Load Select components only on the client to prevent SSR/client id mismatches
const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false },
) as any;
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false },
) as any;
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false },
) as any;
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false },
) as any;
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false },
) as any;
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { createEscritoAction } from "../../escrito/escrito-actions";

interface Option {
  id: number;
  nombre: string;
}

interface EditorFormProps {
  autores: Option[];
  etiquetasDisponibles: Option[];
}

const EditorField = dynamic(
  () => import("./editor").then((mod) => mod.EditorField),
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

export function CreateForm({
  autores,
  etiquetasDisponibles,
}: {
  autores: any[];
  etiquetasDisponibles: any[]; // 3. Asegúrate de recibirla aquí
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
      titulo_escrito: "",
      resumen: "",
      autor: "",
      etiquetas: [],
      contenido: [{ type: "p", children: [{ text: "" }] }],
      link_documento: "",
      link_imagen: "",
      publicar: false,
    },
  });

  const currentResumen = watch("resumen") || "";
  const currentEtiquetas = watch("etiquetas") || [];

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Ejecución de la Server Action real
      const result = await createEscritoAction(data);

      if (result?.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);

      // Delay breve para mostrar el estado de éxito antes de redirigir
      setTimeout(() => {
        router.push("/escrito/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(
        "Hubo un error al guardar el artículo. Por favor, intenta de nuevo.",
      );
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
              Crear Artículo
            </FieldLegend>

            <FieldGroup className="mt-8 space-y-6">
              {/* TÍTULO */}
              <Field>
                <FieldLabel className="text-sm font-semibold">
                  Título del escrito
                </FieldLabel>
                <Input
                  {...register("titulo_escrito")}
                  placeholder="Ej: Tendencias en IA 2026"
                  className={
                    errors.titulo_escrito
                      ? "border-destructive ring-destructive/20"
                      : "focus:ring-primary/20"
                  }
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
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      currentResumen.length > 140
                        ? "bg-destructive/10 text-destructive font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentResumen.length} / 140
                  </span>
                </div>
                <Textarea
                  {...register("resumen")}
                  placeholder="Escribe un resumen atractivo para redes sociales..."
                  rows={3}
                  className={
                    errors.resumen
                      ? "border-destructive ring-destructive/20"
                      : "resize-none focus:ring-primary/20"
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
                              {/* Nota: Asegúrate si es a.nombre o a.name según tu DB */}
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
                    onValueChange={(value: string) => {
                      // Evita duplicados al agregar
                      if (!currentEtiquetas.includes(value)) {
                        setValue("etiquetas", [...currentEtiquetas, value]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona etiquetas" />
                    </SelectTrigger>
                    <SelectContent>
                      {etiquetasDisponibles.map((tag) => (
                        <SelectItem key={tag.id} value={tag.name}>
                          {" "}
                          {/* Usamos el nombre como valor */}
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* ... el resto del código de los "pills" (badges) está bien ... */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {currentEtiquetas.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2 animate-in zoom-in-95 duration-200"
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
                          className="hover:text-destructive transition-colors"
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
                      className={`min-h-75 rounded-lg overflow-hidden transition-all border-2 ${
                        errors.contenido
                          ? "border-destructive"
                          : "border-input focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5"
                      }`}
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
                    Link Documento (Opcional)
                  </FieldLabel>
                  <Input
                    {...register("link_documento")}
                    placeholder="https://drive.google.com/..."
                    className="focus:ring-primary/20"
                  />
                  <ErrorDisplay message={errors.link_documento?.message} />
                </Field>
                <Field>
                  <FieldLabel className="text-sm font-semibold">
                    Link Imagen de Portada
                  </FieldLabel>
                  <Input
                    {...register("link_imagen")}
                    placeholder="https://images.unsplash.com/..."
                    className="focus:ring-primary/20"
                  />
                  <ErrorDisplay message={errors.link_imagen?.message} />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator className="my-10" />

          {/* PUBLICAR SWITCH */}
          <div className="flex items-center justify-between p-6 border rounded-2xl bg-muted/20 backdrop-blur-sm">
            <div className="space-y-1">
              <FieldLabel className="text-base font-bold">
                Estado de publicación
              </FieldLabel>
              <FieldDescription className="text-sm text-muted-foreground">
                Si activas esta opción, el artículo será visible para todos los
                usuarios.
              </FieldDescription>
            </div>
            <Controller
              name="publicar"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-primary"
                />
              )}
            />
          </div>

          {/* ACCIONES */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10">
            <Button
              type="submit"
              size="lg"
              className={`flex-2 h-12 text-base font-bold transition-all duration-300 ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700 scale-[1.01] shadow-lg shadow-green-200"
                  : ""
              }`}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Guardando cambios...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> ¡Publicado con éxito!
                </span>
              ) : (
                "Guardar y Publicar Artículo"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="flex-1 h-12 text-base font-medium"
              disabled={isSubmitting || isSuccess}
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
    <p className="text-[13px] font-semibold text-destructive mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
      <span className="h-1 w-1 bg-destructive rounded-full" />
      {message}
    </p>
  ) : null;

export default CreateForm;
