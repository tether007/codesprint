const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.challenge.createMany({
    data: [
      {
        title: "Digital Footprint",
        description: "Forensics challenge",
        points: 7,
        flag: "CTF{hidden_metadata_found}",
      },
      {
        title: "Built Once",
        description: "Frontend env build issue",
        points: 10,
        flag: "CTF{build_time_env}",
      },
    ],
  });

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
