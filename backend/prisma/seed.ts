import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const teams = [
  "Barcelona",
  "Real Madrid",
  "Manchester United",
  "Liverpool",
  "Arsenal",
  "Chelsea",
  "Bayern Munich",
  "Dortmund",
  "PSG",
  "Juventus",
  "AC Milan",
  "Inter Milan",
  "Atletico Madrid",
  "Napoli",
  "Leverkusen",
  "Tottenham",
];

const leagues = ["La Liga", "EPL", "Bundesliga", "Serie A", "Ligue 1"];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function generateMatch() {
  let teamA = getRandom(teams);
  let teamB = getRandom(teams);

  // ensure no duplicate teams
  while (teamA === teamB) {
    teamB = getRandom(teams);
  }

  const strongVsWeak = Math.random() > 0.5;

  const teamA_rating = strongVsWeak
    ? Math.floor(Math.random() * 10) + 85
    : Math.floor(Math.random() * 20) + 70;

  const teamB_rating = strongVsWeak
    ? Math.floor(Math.random() * 20) + 65
    : Math.floor(Math.random() * 20) + 70;

  return {
    sport: "Football",
    league: getRandom(leagues),
    teamA,
    teamB,
    startTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
    teamA_rating,
    teamB_rating,
  };
}

async function main() {
  console.log("Seeding matches...");

  const matches = Array.from({ length: 80 }, generateMatch);

  await prisma.match.createMany({
    data: matches,
    skipDuplicates: true,
  });

  console.log("Seeded...");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
