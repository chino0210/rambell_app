import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  // Crear usuarios
  const hashedPassword1 = await bcrypt.hash("rambell0210AA$$", 10);

  const user2 = await prisma.user.create({
    data: {
      email: "rambell.admin@gmail.com",
      password: hashedPassword1,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Crear autores
  const autor1 = await prisma.autor.create({
    data: {
      name: "Jose Ramos FLores",
      image: "https://example.com/autor1.jpg",
    },
  });

  const autor2 = await prisma.autor.create({
    data: {
      name: "Jose Ramos FLores 2",
      image: "https://example.com/autor1.jpg",
    },
  });

  const autor3 = await prisma.autor.create({
    data: {
      name: "Jose Ramos FLores 3",
      image: "https://example.com/autor1.jpg",
    },
  });

  // --- TAGS ---
  // // --- CIVIL ---
  const civil1 = await prisma.tag.create({
    data: { name: "Civil", color: "#33FF57", code_name: "civ_civil" },
  });
  const civil2 = await prisma.tag.create({
    data: {
      name: "Procesal Civil",
      color: "#33FF57",
      code_name: "civ_procesal",
    },
  });
  const civil3 = await prisma.tag.create({
    data: {
      name: "Legislación Civil",
      color: "#33FF57",
      code_name: "civ_legislacion",
    },
  });
  const civil4 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Civil",
      color: "#33FF57",
      code_name: "civ_jurisprudencia",
    },
  });

  // --- FAMILIA ---
  const familia1 = await prisma.tag.create({
    data: { name: "Familia", color: "#FF33F6", code_name: "fam_familia" },
  });
  const familia2 = await prisma.tag.create({
    data: {
      name: "Derecho de menores",
      color: "#FF33F6",
      code_name: "fam_menores",
    },
  });
  const familia3 = await prisma.tag.create({
    data: {
      name: "Legislación Familia",
      color: "#FF33F6",
      code_name: "fam_legislacion",
    },
  });
  const familia4 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Familia",
      color: "#FF33F6",
      code_name: "fam_jurisprudencia",
    },
  });

  // --- PENAL ---
  const penal1 = await prisma.tag.create({
    data: {
      name: "Penal",
      color: "#FF5733",
      code_name: "pen_penal",
    },
  });
  const penal2 = await prisma.tag.create({
    data: {
      name: "Penal Especial",
      color: "#FF5733",
      code_name: "pen_especial",
    },
  });
  const penal3 = await prisma.tag.create({
    data: {
      name: "Procesal Penal",
      color: "#FF5733",
      code_name: "pen_procesal",
    },
  });
  const penal4 = await prisma.tag.create({
    data: {
      name: "Legislación Penal",
      color: "#FF5733",
      code_name: "pen_legislacion",
    },
  });
  const penal5 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Penal",
      color: "#FF5733",
      code_name: "pen_jurisprudencia",
    },
  });

  // --- LABORAL ---
  const laboral1 = await prisma.tag.create({
    data: {
      name: "Laboral Privado",
      color: "#33FFF3",
      code_name: "laboral_privado",
    },
  });
  const laboral2 = await prisma.tag.create({
    data: {
      name: "Laboral Público",
      color: "#33FFF3",
      code_name: "laboral_publico",
    },
  });
  const laboral3 = await prisma.tag.create({
    data: { name: "Cas", color: "#33FFF3", code_name: "laboral_cas" },
  });
  const laboral4 = await prisma.tag.create({
    data: {
      name: "Servicio Civil",
      color: "#33FFF3",
      code_name: "laboral_servicio",
    },
  });
  const laboral5 = await prisma.tag.create({
    data: {
      name: "Legislación Laboral",
      color: "#33FFF3",
      code_name: "laboral_legislacion",
    },
  });

  const laboral6 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Laboral",
      color: "#33FFF3",
      code_name: "laboral_jurisprudencia",
    },
  });

  // --- ADMINISTRATIVO ---
  const admin1 = await prisma.tag.create({
    data: {
      name: "Administrativo",
      color: "#3357FF",
      code_name: "admin_administrativo",
    },
  });
  const admin2 = await prisma.tag.create({
    data: {
      name: "Contencioso Administrativo",
      color: "#3357FF",
      code_name: "admin_contencioso",
    },
  });
  const admin3 = await prisma.tag.create({
    data: {
      name: "Legislación Administrativa",
      color: "#3357FF",
      code_name: "admin_legislacion",
    },
  });
  const admin4 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Administrativa",
      color: "#3357FF",
      code_name: "admin_jurisprudencia",
    },
  });

  // --- PENSIONARIO ---
  const pens1 = await prisma.tag.create({
    data: {
      name: "Régimen Público",
      color: "#FFBD33",
      code_name: "pension_publico",
    },
  });
  const pens2 = await prisma.tag.create({
    data: {
      name: "Régimen Privado",
      color: "#FFBD33",
      code_name: "pension_privado",
    },
  });
  const pens3 = await prisma.tag.create({
    data: {
      name: "Legislación Pensionaria",
      color: "#FFBD33",
      code_name: "pension_legislacion",
    },
  });
  const pens4 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Pensionaria",
      color: "#FFBD33",
      code_name: "pension_jurisprudencia",
    },
  });

  // --- CONSTITUCIONAL ---
  const const1 = await prisma.tag.create({
    data: {
      name: "Constitucional",
      color: "#8D33FF",
      code_name: "const_constitucional",
    },
  });
  const const2 = await prisma.tag.create({
    data: {
      name: "Procesal Constitucional",
      color: "#8D33FF",
      code_name: "const_procesal",
    },
  });
  const const3 = await prisma.tag.create({
    data: {
      name: "Derechos Humanos",
      color: "#8D33FF",
      code_name: "const_derechos",
    },
  });
  const const4 = await prisma.tag.create({
    data: {
      name: "Legislación Constitucional",
      color: "#8D33FF",
      code_name: "const_legislacion",
    },
  });
  const const5 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Constitucional",
      color: "#8D33FF",
      code_name: "const_jurisprudencia",
    },
  });

  // --- EMPRESARIAL ---
  const emp1 = await prisma.tag.create({
    data: { name: "Empresarial", color: "#FF3380", code_name: "emp_empresarial" },
  });
  const emp2 = await prisma.tag.create({
    data: {
      name: "Legislación Empresarial",
      color: "#FF3380",
      code_name: "emp_legislacion",
    },
  });
  const emp3 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Empresarial",
      color: "#FF3380",
      code_name: "emp_jurisprudencia",
    },
  });

  // --- TRIBUTARIO ---
  const trib1 = await prisma.tag.create({
    data: {
      name: "Tributario",
      color: "#33FFB5",
      code_name: "trib_tributario",
    },
  });
  const trib2 = await prisma.tag.create({
    data: {
      name: "Contencioso Tributario",
      color: "#33FFB5",
      code_name: "trib_contencioso",
    },
  });
  const trib3 = await prisma.tag.create({
    data: {
      name: "Legislación Tributaria",
      color: "#33FFB5",
      code_name: "trib_legislacion",
    },
  });
  const trib4 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Tributaria",
      color: "#33FFB5",
      code_name: "trib_jurisprudencia",
    },
  });

  // --- REGISTRAL ---
  const reg1 = await prisma.tag.create({
    data: { name: "Registral", color: "#A5FF33", code_name: "reg_registral" },
  });
  const reg2 = await prisma.tag.create({
    data: {
      name: "Legislación Registral",
      color: "#A5FF33",
      code_name: "reg_legislacion",
    },
  });
  const reg3 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Registral",
      color: "#A5FF33",
      code_name: "reg_jurisprudencia",
    },
  });

  // --- MUNICIPAL ---
  const mun1 = await prisma.tag.create({
    data: {
      name: "Municipal",
      color: "#FF5733",
      code_name: "mun_municipal",
    },
  });
  const mun2 = await prisma.tag.create({
    data: {
      name: "Legislación Municipal",
      color: "#FF5733",
      code_name: "mun_legislacion",
    },
  });
  const mun3 = await prisma.tag.create({
    data: {
      name: "Jurisprudencia Municipal",
      color: "#FF5733",
      code_name: "mun_jurisprudencia",
    },
  });

  // --- INVESTIGACIÓN ---
  const inv1 = await prisma.tag.create({
    data: { name: "Proyectos", color: "#5865F2", code_name: "inv_proyectos" },
  });
  const inv2 = await prisma.tag.create({
    data: { name: "Tesis", color: "#5865F2", code_name: "inv_tesis" },
  });
  const inv3 = await prisma.tag.create({
    data: { name: "Tesinas", color: "#5865F2", code_name: "inv_tesinas" },
  });
  const inv4 = await prisma.tag.create({
    data: { name: "Artículos", color: "#5865F2", code_name: "inv_articulos" },
  });
  const inv5 = await prisma.tag.create({
    data: { name: "Ensayos", color: "#5865F2", code_name: "inv_ensayos" },
  });

  const allTags = [
    civil1, civil2, civil3, civil4,
    familia1, familia2, familia3, familia4,
    penal1, penal2, penal3, penal4, penal5,
    laboral1, laboral2, laboral3, laboral4, laboral5, laboral6,
    admin1, admin2, admin3, admin4,
    pens1, pens2, pens3, pens4,
    const1, const2, const3, const4, const5,
    emp1, emp2, emp3,
    trib1, trib2, trib3, trib4,
    reg1, reg2, reg3,
    mun1, mun2, mun3,
    inv1, inv2, inv3, inv4, inv5,
  ];

  const autores = [autor1, autor2, autor3];

  // Crear un escrito por cada etiqueta existente
  for (const tag of allTags) {
    await prisma.escrito.create({
      data: {
        titulo_escrito: `Artículo sobre ${tag.name}`,
        resumen: `Un resumen detallado sobre ${tag.name}. Este artículo explora los aspectos clave de esta área del derecho.`,
        autorId: autores[Math.floor(Math.random() * autores.length)].id,
        contenido: [
          {
            type: 'p',
            children: [
              {
                text: `Contenido generado para la etiqueta ${tag.name}. Este es un texto de ejemplo que representa el contenido de un artículo en esta categoría jurídica. Aquí se incluirían análisis, jurisprudencia, legislación y consideraciones prácticas relacionadas con ${tag.name.toLowerCase()}.`
              }
            ]
          }
        ],
        link_documento: `https://example.com/doc_${tag.code_name}.pdf`,
        link_imagen: "https://blog.lemontech.com/hubfs/Imported_Blog_Media/dia-del-abogado-internacional-Aug-14-2025-06-43-13-8696-AM-2.jpg",
        status: "PUBLICADO",
        tags: {
          connect: [{ id: tag.id }],
        },
      },
    });
  }

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
