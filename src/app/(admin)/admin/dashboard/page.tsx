import prisma from "@/lib/prisma";
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  // Validación de seguridad doble
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
