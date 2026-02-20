const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const challenges = [
    {
      title: "Digital Footprint",
      description: "Forensics challenge",
      points: 7,
      flag: "CTF{cubbonpark_4}",
    },
    {
      title: "Built Once",
      description: "Frontend env build issue",
      points: 8,
      flag: "CTF{build_time_env}",
    },
    {
      title: "Ancient Cipher Archive",
      description:
        "Dr. Elena Marsh left behind a multi-layered archaeological cipher. Discover the hidden discovery date.",
      points: 10,
      flag: "CTF{25-10-2021}",
    },
  ];

    for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { title: challenge.title },
      update: {}, 
      create: challenge,
    });
}

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });