"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { BookmarkIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleGuardarEscrito } from "@/app/actions/favorite";

interface BotonGuardarProps {
  idDocumento: string;
  initialIsGuardado: boolean; // Nuevo prop
}

export function BotonGuardar({
  idDocumento,
  initialIsGuardado,
}: BotonGuardarProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [loading, setLoading] = useState(false);
  const [isGuardado, setIsGuardado] = useState(initialIsGuardado);

  const handleGuardar = async () => {
    if (status === "unauthenticated") {
      toast.error("Inicia sesión para guardar este escrito");
      return;
    }

    setLoading(true);
    // Optimistic UI: Cambiamos el estado antes de la respuesta del servidor
    const prevStatus = isGuardado;
    setIsGuardado(!prevStatus);

    try {
      const result = await toggleGuardarEscrito(idDocumento);

      if (result.success) {
        toast.success(
          result.estado === "guardado" ? "¡Guardado!" : "Eliminado",
        );
      } else {
        // Si hay error, revertimos el cambio
        setIsGuardado(prevStatus);
        toast.error(result.error);
      }
    } catch (error) {
      setIsGuardado(prevStatus);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGuardar}
      disabled={loading}
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 rounded-xl py-6 transition-all duration-300 border ${
        !isAuthenticated
          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
          : isGuardado
          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
          : "border-blue-100 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {!isAuthenticated ? (
        <>
          <BookmarkIcon
            className={`size-5 ${loading ? "animate-pulse" : ""}`}
          />
          <span className="font-bold">Necesita iniciar sesión</span>
        </>
      ) : isGuardado ? (
        <>
          <CheckCircle2 className="size-5 fill-green-600 text-white" />
          <span className="font-bold">Artículo Guardado</span>
        </>
      ) : (
        <>
          <BookmarkIcon
            className={`size-5 ${loading ? "animate-pulse" : ""}`}
          />
          <span className="font-bold">Guardar este escrito</span>
        </>
      )}
    </Button>
  );
}
