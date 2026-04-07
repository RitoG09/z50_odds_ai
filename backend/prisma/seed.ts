import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

async function main() {
  await prisma.match.createMany({
    data: [
      {
        sport: "Football",
        league: "La Liga",
        teamA: "Barcelona",
        teamB: "Real Madrid",
        startTime: new Date(),
        teamA_rating: 85,
        teamB_rating: 83,
      },
    ],
  });
}

main()
  .then(() => console.log("Seeded done.."))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
