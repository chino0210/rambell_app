// components/card-model.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface CardModelProps {
  escrito: {
    id: string;
    titulo_escrito: string;
    resumen?: string;
    link_imagen?: string | null;
    tags?: { id: number; name: string; color: string }[];
  };
}

export default function CardModelNavBar({ escrito }: CardModelProps) {
  if (!escrito) return null;

  return (
    <Card className="p-0 group relative mx-auto w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-card shadow-none transition-all duration-300">
      {/* Imagen */}
      <div className="relative aspect-video w-full overflow-hidden">
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src={escrito.link_imagen || "/Fondo Prueba.avif"}
          alt={escrito.titulo_escrito}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {escrito.tags?.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color }}
              className="border-none text-white rounded-full px-3 shadow-none text-[10px]"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* --- CONTENEDOR COMPACTO --- */}
      <div className="p-4 space-y-3">
        {" "}
        {/* Ajusta 'space-y' para controlar la distancia total */}
        <CardHeader className="p-0 space-y-0">
          <CardTitle className="line-clamp-2 text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            {escrito.titulo_escrito}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-0">
          <Button
            asChild
            size="sm" // Tamaño más pequeño para que no se vea tosco al estar cerca
            className="w-full font-bold tracking-wide transition-all hover:gap-2 rounded-xl shadow-none h-9"
          >
            <Link href={`/escrito/${escrito.id}`}>
              Ver Escrito
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
