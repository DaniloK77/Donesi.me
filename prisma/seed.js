const { DealCategory, PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const deals = [
  {
    name: "GoodFellas",
    label: "Restaurant",
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
    imageUrl: "/images/deals/paradise-food.jpeg",
    category: DealCategory.VEGAN,
  },
  {
    name: "Oses Vegan Ćufte",
    label: "Restaurant",
    discountPercentage: 10,
    imageUrl: "/images/deals/oses-vegan.jpeg",
    category: DealCategory.VEGAN,
  },
  {
    name: "Green & Protein",
    label: "Restaurant",
    discountPercentage: 20,
    imageUrl: "/images/deals/green-protein.jpeg",
    category: DealCategory.VEGAN,
  },
  {
    name: "NAMA Sushi & Coffee",
    label: "Restaurant",
    discountPercentage: 25,
    imageUrl: "/images/deals/nama-sushi.jpg",
    category: DealCategory.SUSHI,
  },
  {
    name: "SushiCo",
    label: "Restaurant",
    discountPercentage: 15,
    imageUrl: "/images/deals/sushi-co.jpeg",
    category: DealCategory.SUSHI,
  },
  {
    name: "Sushi Market",
    label: "Restaurant",
    discountPercentage: 10,
    imageUrl: "/images/deals/sushi-market.png",
    category: DealCategory.SUSHI,
  },
];

const categories = [
  {
    name: "Burgers & Fast food",
    restaurantCount: 21,
    slug: "burgers-fast-food",
    imageUrl: "/images/categories/burgers.png",
  },
  {
    name: "Salads",
    restaurantCount: 32,
    slug: "salads",
    imageUrl: "/images/categories/salads.png",
  },
  {
    name: "Pasta & Casuals",
    restaurantCount: 4,
    slug: "pasta-casuals",
    imageUrl: "/images/categories/pasta.png",
  },
  {
    name: "Pizza",
    restaurantCount: 32,
    slug: "pizza",
    imageUrl: "/images/categories/pizza.png",
  },
  {
    name: "Breakfast",
    restaurantCount: 4,
    slug: "breakfast",
    imageUrl: "/images/categories/breakfast.png",
  },
  {
    name: "Soups",
    restaurantCount: 32,
    slug: "soups",
    imageUrl: "/images/categories/soups.png",
  },
];

const popularRestaurants = [
  {
    name: "Burger King",
    slug: "burger-king",
    displayOrder: 1,
    logoUrl: "/images/restaurants/burger-king-logo.png",
  },
  {
    name: "Home of Gyros",
    slug: "home-of-gyros",
    displayOrder: 2,
    logoUrl: "/images/restaurants/home-of-gyros.png",
  },
  {
    name: "GoodFellas",
    slug: "goodfellas",
    displayOrder: 3,
    logoUrl: "/images/restaurants/goodfellas.jpeg",
  },
  {
    name: "BBQ & More Podgorica",
    slug: "bbq-more-podgorica",
    displayOrder: 4,
    logoUrl: "/images/deals/bbq-podgorica.jpeg",
  },
  {
    name: "Green & Protein",
    slug: "green-protein",
    displayOrder: 5,
    logoUrl: "/images/restaurants/green-and-protein.png",
  },
  {
    name: "Sushi Co",
    slug: "sushi-co",
    displayOrder: 6,
    logoUrl: "/images/restaurants/sushi-co.jpeg",
  },
  {
    name: "Ulix",
    slug: "ulix",
    displayOrder: 7,
    logoUrl: "/images/restaurants/ulix.jpeg",
  },
];

async function main() {
  await prisma.deal.deleteMany();
  await prisma.deal.createMany({
    data: deals,
  });

  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: {
          slug: category.slug,
        },
        update: category,
        create: category,
      }),
    ),
  );

  await Promise.all(
    popularRestaurants.map((restaurant) =>
      prisma.popularRestaurant.upsert({
        where: {
          slug: restaurant.slug,
        },
        update: restaurant,
        create: restaurant,
      }),
    ),
  );
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
