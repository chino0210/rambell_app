-- CreateTable
CREATE TABLE "usuario_vistas" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "escritoId" TEXT NOT NULL,
    "lastViewed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_vistas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_vistas_userId_escritoId_key" ON "usuario_vistas"("userId", "escritoId");

-- AddForeignKey
ALTER TABLE "usuario_vistas" ADD CONSTRAINT "usuario_vistas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_vistas" ADD CONSTRAINT "usuario_vistas_escritoId_fkey" FOREIGN KEY ("escritoId") REFERENCES "escritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
