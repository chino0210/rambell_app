"use client";

import { useState } from "react"; // Nuevo: para controlar el estado de éxito
import { useRouter } from "next/navigation"; // Nuevo: para redirigir
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "../../actions/zod";
import { registerUserAction } from "@/app/actions/actions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Mail, Lock, User, CheckCircle2, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const result = await registerUserAction(values);

    if (result?.error) {
      alert(result.error);
    } else {
      // 1. Activamos el estado de éxito
      setIsSuccess(true);

      // 2. Esperamos 2 segundos para que vea el botón verde y redirigimos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div
              className={`p-3 rounded-full transition-colors ${isSuccess ? "bg-green-100" : "bg-primary/10"}`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <UserPlus className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSuccess ? "¡Registro exitoso!" : "Crear cuenta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? "Te estamos redirigiendo al inicio de sesión..."
              : "Ingresa tus datos para registrarte en la plataforma"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* --- CAMPO NOMBRE --- */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground ml-1">
                      Nombre
                    </FormLabel>
                    <div className="flex items-center w-full border-b border-input focus-within:border-primary transition-colors px-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          placeholder="Tu nombre"
                          {...field}
                          disabled={isSuccess} // Bloquear mientras redirige
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- CAMPO EMAIL --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground ml-1">
                      Email
                    </FormLabel>
                    <div className="flex items-center w-full border-b border-input focus-within:border-primary transition-colors px-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ejemplo@correo.com"
                          {...field}
                          disabled={isSuccess}
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- CAMPO PASSWORD --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground ml-1">
                      Contraseña
                    </FormLabel>
                    <div className="flex items-center w-full border-b border-input focus-within:border-primary transition-colors px-1">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isSuccess}
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-10"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSuccess}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className={`w-full font-semibold transition-all duration-300 ${
                  isSuccess
                    ? "bg-green-600 hover:bg-green-600 cursor-default"
                    : "bg-primary"
                }`}
                disabled={form.formState.isSubmitting || isSuccess}
              >
                {form.formState.isSubmitting ? (
                  "Registrando..."
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    Usuario registrado <CheckCircle2 className="h-4 w-4" />
                  </span>
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
