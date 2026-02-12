"use server";

import { signIn } from "@/app/actions/auth"; // OJO: Impórtalo de donde definiste NextAuth completo
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "./zod";
import { AuthError } from "next-auth";

// --- ACCIÓN DE LOGIN ---
export async function loginUserAction(values: any) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Datos de acceso inválidos" };
  }

  try {
    await signIn("credentials", {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales incorrectas" };
        default:
          return { error: "Algo salió mal en el inicio de sesión" };
      }
    }
    // IMPORTANTE: Next.js necesita que lances el error si es un redirect
    throw error;
  }
}

// --- ACCIÓN DE REGISTRO ---
export async function registerUserAction(values: any) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Datos de registro inválidos" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) return { error: "El correo ya existe" };

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "USER" },
    });

    return { success: "Usuario creado con éxito" };
  } catch (error) {
    return { error: "Error al crear el usuario" };
  }
}
