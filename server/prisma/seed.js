const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Real Madrid Home Jersey",
        description: "Official Real Madrid home jersey 2024",
        price: 79.99,
        imageUrl: "/images/realmadrid.jpg",
        team: "Real Madrid",
        stock: 10,
      },
      {
        name: "Barcelona Home Jersey",
        description: "Official Barcelona home jersey 2024",
        price: 75.99,
        imageUrl: "/images/barcelona.jpg",
        team: "Barcelona",
        stock: 15,
      },
      {
        name: "Manchester United Jersey",
        description: "Manchester United classic jersey",
        price: 82.99,
        imageUrl: "/images/manutd.jpg",
        team: "Manchester United",
        stock: 12,
      },
      {
        name: "PSG Jersey",
        description: "Paris Saint-Germain premium jersey",
        price: 85.99,
        imageUrl: "/images/psg.jpg",
        team: "PSG",
        stock: 8,
      },
      {
        name: "Liverpool Jersey",
        description: "Liverpool home jersey 2024",
        price: 78.99,
        imageUrl: "/images/liverpool.jpg",
        team: "Liverpool",
        stock: 14,
      }
    ],
  });

  console.log("✅ Products added!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });