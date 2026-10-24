import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient();
  console.log("Intentando conectar a la base de datos...");
  try {
    const userCount = await prisma.user.count();
    console.log(`Conexión exitosa. Usuarios registrados: ${userCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 5 });
      console.log("Primeros 5 usuarios:");
      users.forEach(u => console.log(`- ${u.email} (ID: ${u.id})`));
    }
  } catch (error: any) {
    console.error("Error al conectar a la base de datos:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
