import prisma from '@/lib/prisma';
import { auth } from '@/app/actions/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    // No user logged in, don't increment views
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  const userId = parseInt(session.user.id);
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  // Check if user has viewed this escrito recently
  const existingView = await prisma.usuarioVistas.findUnique({
    where: {
      userId_escritoId: { userId, escritoId: id },
    },
  });

  if (existingView && existingView.lastViewed > twoHoursAgo) {
    // Viewed within last 2 hours, don't increment
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Either no view or old view, update/create and increment
  await prisma.$transaction([
    prisma.usuarioVistas.upsert({
      where: {
        userId_escritoId: { userId, escritoId: id },
      },
      update: {
        lastViewed: new Date(),
      },
      create: {
        userId,
        escritoId: id,
        lastViewed: new Date(),
      },
    }),
    prisma.escrito.update({
      where: { id },
      data: { views: { increment: 1 } },
    }),
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
