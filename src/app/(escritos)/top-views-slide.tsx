import prisma from "@/lib/prisma";
import CardModel from "./card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TopViewsSlideProps {
  code_names?: { code_name: string; categoria: string }[] | null;
}

export default async function TopViewsSlide({ code_names }: TopViewsSlideProps) {
  const where: any = { status: "PUBLICADO" };
  if (code_names && code_names.length > 0) {
    where.tags = { some: { code_name: { in: code_names.map(cn => cn.code_name) } } };
  }

  const topEscritos = await prisma.escrito.findMany({
    where,
    take: 6,
    include: { tags: true, autor: true },
    orderBy: { views: "desc" },
  });

  if (topEscritos.length === 0) return null;

  return (
    <section className="px-10 py-5">
      <h2 className="text-3xl font-bold text-heading mb-6 text-center">
        Articulos mas relevantes:
      </h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-full mx-auto"
      >
        <CarouselContent>
          {topEscritos.map((escrito) => (
            <CarouselItem key={escrito.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <CardModel escrito={escrito} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
