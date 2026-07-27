const { DealCategory, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const deals = [
  {
    name: "GoodFellas",
    label: "Fast Food",
    discountPercentage: 40,
    imageUrl: "/images/deals/goodfellas.jpg",
    category: DealCategory.PIZZA_FASTFOOD,
  },
  {
    name: "Burger King",
    label: "Fast Food",
    discountPercentage: 20,
    imageUrl: "/images/deals/burgerking.png",
    category: DealCategory.PIZZA_FASTFOOD,
  },
  {
    name: "BBQ Podgorica",
    label: "Fast Food",
    discountPercentage: 17,
    imageUrl: "/images/deals/bbq-podgorica.jpeg",
    category: DealCategory.PIZZA_FASTFOOD,
  },
  {
    name: "Paradise Food",
    label: "Restaurant",
    discountPercentage: 15,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.VEGAN,
  },
  {
    name: "Oses Vegan Ćufte",
    label: "Restaurant",
    discountPercentage: 10,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.VEGAN,
  },
  {
    name: "Green & Protein",
    label: "Restaurant",
    discountPercentage: 20,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.VEGAN,
  },
  {
    name: "NAMA Sushi & Coffee",
    label: "Restaurant",
    discountPercentage: 25,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.SUSHI,
  },
  {
    name: "SushiCo",
    label: "Restaurant",
    discountPercentage: 15,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.SUSHI,
  },
  {
    name: "Sushi Market",
    label: "Restaurant",
    discountPercentage: 10,
    imageUrl: "/images/deals/placeholder.jpg",
    category: DealCategory.SUSHI,
  },
];

async function main() {
  await prisma.deal.deleteMany();
  await prisma.deal.createMany({
    data: deals,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
