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

const item = (name, description, price, isFeatured = false) => ({
  name,
  description,
  price,
  isFeatured,
});

const restaurants = [
  {
    name: "Burger King",
    slug: "burger-king",
    logoUrl: "/images/restaurants/burger-king-logo.png",
    coverImageUrl: "/images/restaurants/burger_king_restaurant.jpeg",
    category: "Fast Food / Burgeri",
    rating: 4.5,
    address: "Ulica slobode, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 25,
    displayOrder: 1,
    menuCategories: [
      {
        name: "Burgeri",
        items: [
          item(
            "Whopper",
            "Goveđa pljeskavica sa grila, zelena salata, paradajz, kisjeli krastavci, luk, majonez i kečap.",
            "5.50",
            true,
          ),
          item(
            "Double Whopper",
            "Dvije goveđe pljeskavice sa grila, svježe povrće, kisjeli krastavci i Whopper sosovi.",
            "7.20",
          ),
          item(
            "Big King XXL",
            "Dvije goveđe pljeskavice, cheddar sir, zelena salata, luk i prepoznatljivi Big King sos.",
            "6.90",
            true,
          ),
          item(
            "Chicken Royale",
            "Hrskavi pileći file, zelena salata i kremasti majonez u duguljastom pecivu.",
            "5.20",
            true,
          ),
          item(
            "Long Chicken",
            "Duguljasti panirani pileći file sa zelenom salatom i majonezom.",
            "4.80",
          ),
          item(
            "Steakhouse Burger",
            "Goveđa pljeskavica, cheddar, hrskavi luk, slanina i dimljeni BBQ sos.",
            "6.50",
          ),
        ],
      },
      {
        name: "Meniji",
        items: [
          item(
            "Whopper Meni",
            "Whopper, srednji pomfrit i gazirano piće 0.4 l po izboru.",
            "8.50",
            true,
          ),
          item(
            "Big King XXL Meni",
            "Big King XXL, srednji pomfrit i gazirano piće 0.4 l po izboru.",
            "9.50",
          ),
          item(
            "Chicken Royale Meni",
            "Chicken Royale, srednji pomfrit i gazirano piće 0.4 l po izboru.",
            "8.20",
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Pomfrit mali", "Zlatno prženi i blago posoljeni pomfrit.", "2.50"),
          item("Pomfrit veliki", "Velika porcija zlatno prženog pomfrita.", "3.50"),
          item("Chicken Nuggets 6 kom", "Šest hrskavih pilećih zalogaja.", "4.00"),
          item("Onion Rings", "Hrskavi kolutovi luka u začinjenoj panadi.", "3.20"),
          item("King Wings 6 kom", "Šest pikantnih pilećih krilaca.", "4.90"),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Coca-Cola 0.4 l", null, "2.00"),
          item("Coca-Cola Zero 0.4 l", null, "2.00"),
          item("Fanta 0.4 l", null, "2.00"),
          item("Voda 0.5 l", null, "1.50"),
        ],
      },
    ],
  },
  {
    name: "Home of Gyros",
    slug: "home-of-gyros",
    logoUrl: "/images/restaurants/home-of-gyros.png",
    coverImageUrl: null,
    category: "Grčka kuhinja / Girosi",
    rating: 4.7,
    address: "Studentska 29, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 30,
    displayOrder: 2,
    menuCategories: [
      {
        name: "Girosi",
        items: [
          item(
            "Pileći giros S",
            "Pileće meso, tzatziki, luk, paradajz i pomfrit u toploj piti.",
            "3.50",
          ),
          item(
            "Pileći giros L",
            "Veća porcija pilećeg mesa, tzatziki, povrće i pomfrit u piti.",
            "4.70",
            true,
          ),
          item(
            "Pileći giros XL",
            "XL porcija piletine sa tzatzikijem, svježim povrćem i pomfritom.",
            "5.90",
            true,
          ),
          item(
            "Svinjski giros S",
            "Svinjsko meso, tzatziki, luk, paradajz i pomfrit u piti.",
            "3.80",
          ),
          item(
            "Svinjski giros XL",
            "XL porcija svinjskog mesa sa tzatzikijem, povrćem i pomfritom.",
            "6.20",
          ),
          item(
            "Miješani giros ljuti",
            "Piletina i svinjetina, pikantni sos, luk, paradajz i pomfrit.",
            "6.50",
            true,
          ),
        ],
      },
      {
        name: "Tanjiri",
        items: [
          item(
            "Pileći giros tanjir",
            "Pileće meso, pomfrit, sezonska salata, tzatziki i pita hljeb.",
            "8.50",
          ),
          item(
            "Svinjski giros tanjir",
            "Svinjsko meso, pomfrit, sezonska salata, tzatziki i pita hljeb.",
            "8.90",
          ),
          item(
            "Miješani giros tanjir",
            "Kombinacija pilećeg i svinjskog mesa sa kompletnim prilozima.",
            "10.90",
            true,
          ),
          item(
            "Vegetarijanski tanjir",
            "Grilovano povrće, feta, pomfrit, tzatziki, salata i pita hljeb.",
            "7.20",
          ),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Voda 0.5 l", null, "1.50"),
          item("Coca-Cola 0.33 l", null, "1.80"),
          item("Fanta 0.33 l", null, "1.80"),
          item("Pivo 0.33 l", null, "2.50"),
        ],
      },
    ],
  },
  {
    name: "GoodFellas",
    slug: "goodfellas",
    logoUrl: "/images/restaurants/goodfellas.jpeg",
    coverImageUrl: null,
    category: "Američka kuhinja / Burgeri",
    rating: 4.6,
    address: "Bulevar Stanka Dragojevića 8, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 35,
    displayOrder: 3,
    menuCategories: [
      {
        name: "Burgeri",
        items: [
          item(
            "Classic Cheeseburger",
            "Goveđa pljeskavica, cheddar, kisjeli krastavci, luk i kućni burger sos.",
            "5.50",
            true,
          ),
          item(
            "BBQ Bacon Burger",
            "Goveđa pljeskavica, hrskava slanina, cheddar, karamelizovani luk i BBQ sos.",
            "6.90",
            true,
          ),
          item(
            "Chicken Caesar Burger",
            "Pileći file, zelena salata, parmezan i kremasti Caesar sos.",
            "6.20",
          ),
          item(
            "Buffalo Chicken Burger",
            "Hrskava piletina, Buffalo sos, salata i dip od plavog sira.",
            "6.50",
            true,
          ),
        ],
      },
      {
        name: "Sendviči i tortilje",
        items: [
          item(
            "Buffalo Chicken Quesadilla",
            "Tortilja punjena pikantnom piletinom, topljenim sirom i povrćem.",
            "5.80",
          ),
          item(
            "Toast šunka i sir",
            "Tostirani hljeb, šunka, topljeni sir i mali prilog.",
            "4.20",
          ),
          item(
            "Pileća tortilja",
            "Grilovana piletina, svježe povrće i sos po izboru.",
            "5.50",
          ),
          item(
            "Philly Steak sendvič",
            "Juneći steak, grilovani luk i paprika, cheddar i kućni sos.",
            "7.40",
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Pomfrit", "Klasični hrskavi pomfrit.", "2.80"),
          item("Onion Rings", "Pohovani kolutovi luka sa sosom.", "3.00"),
          item(
            "Loaded Fries",
            "Pomfrit sa cheddar sosom, slaninom i mladim lukom.",
            "4.90",
            true,
          ),
          item(
            "Caesar salata",
            "Zelena salata, krutoni, parmezan i Caesar dresing.",
            "4.50",
          ),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Voda 0.5 l", null, "1.50"),
          item("Coca-Cola 0.33 l", null, "1.80"),
          item("Fanta 0.33 l", null, "1.80"),
          item("Next sok 0.2 l", null, "1.80"),
        ],
      },
    ],
  },
  {
    name: "BBQ & More Podgorica",
    slug: "bbq-more-podgorica",
    logoUrl: "/images/deals/bbq-podgorica.jpeg",
    coverImageUrl: null,
    category: "Roštilj / Balkanska kuhinja",
    rating: 4.5,
    address: "Bulevar Pera Ćetkovića, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 35,
    displayOrder: 4,
    menuCategories: [
      {
        name: "Roštilj",
        items: [
          item(
            "Ćevapi 10 kom",
            "Deset ćevapa sa roštilja, luk, kajmak i svježi somun.",
            "6.50",
            true,
          ),
          item(
            "Pljeskavica",
            "Sočna pljeskavica od miješanog mesa sa lukom i prilozima.",
            "5.90",
          ),
          item(
            "Gurmanska pljeskavica",
            "Pljeskavica sa sirom i pikantnom paprikom, servirana u somunu.",
            "7.20",
            true,
          ),
          item(
            "Bijela vješalica",
            "Marinirani svinjski vrat sa žara i prilogom po izboru.",
            "7.50",
            true,
          ),
          item(
            "Ražnjići 2 kom",
            "Dva ražnjića od svinjskog mesa sa grilovanim povrćem.",
            "7.90",
          ),
          item(
            "Miješano meso tanjir",
            "Ćevapi, pljeskavica, vješalica i kobasica sa kompletnim prilozima.",
            "12.90",
            true,
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Pomfrit", "Porcija hrskavog pomfrita.", "2.50"),
          item("Somun", "Topao somun sa roštilja.", "1.00"),
          item("Kajmak", "Porcija domaćeg kajmaka.", "2.00"),
          item(
            "Šopska salata",
            "Paradajz, krastavac, paprika, luk i rendani sir.",
            "3.50",
          ),
          item("Ajvar", "Porcija blagog domaćeg ajvara.", "1.50"),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Voda 0.5 l", null, "1.50"),
          item("Coca-Cola 0.33 l", null, "1.80"),
          item("Nikšićko pivo 0.5 l", null, "2.80"),
          item("Jogurt 0.2 l", null, "1.50"),
        ],
      },
    ],
  },
  {
    name: "Green & Protein",
    slug: "green-protein",
    logoUrl: "/images/restaurants/green-and-protein.png",
    coverImageUrl: null,
    category: "Zdrava hrana / Bowl-ovi",
    rating: 4.8,
    address: "Baku 7, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 30,
    displayOrder: 5,
    menuCategories: [
      {
        name: "Bowl-ovi",
        items: [
          item(
            "Mindful Poke Bowl",
            "Integralni pirinač, spanać, edamame, avokado, nar, šargarepa, crveni kupus i soja dresing.",
            "6.50",
            true,
          ),
          item(
            "Protein Beast Bowl",
            "Marinirana piletina, avokado, rotkvica, kukuruz, kuvano jaje i susam.",
            "6.90",
            true,
          ),
          item(
            "Super Greens Veggie Bowl",
            "Kinoa, pljeskavica od sočiva, pečurke, brokoli i cherry paradajz.",
            "6.20",
          ),
          item(
            "South Asian Dhal Bowl",
            "Integralni pirinač, dhal od crvenog sočiva, batat, karfiol i spanać.",
            "6.20",
          ),
        ],
      },
      {
        name: "Salate i wrap-ovi",
        items: [
          item(
            "Chicken Charm salata",
            "Grilovana piletina, miks zelenih salata, povrće i dresing po izboru.",
            "6.50",
            true,
          ),
          item(
            "Tunalicious salata",
            "Tuna, zelena salata, kukuruz, paradajz, masline i lagani dresing.",
            "6.90",
          ),
          item(
            "Zdrava pileća tortilja",
            "Tortilja sa spanaćem i lanom, piletina, povrće i jogurt dresing.",
            "5.50",
          ),
          item(
            "Falafel wrap",
            "Falafel, humus, svježe povrće i tahini sos u integralnoj tortilji.",
            "5.90",
          ),
        ],
      },
      {
        name: "Smoothie i sokovi",
        items: [
          item(
            "Svježe cijeđena pomorandža",
            "Svježe cijeđeni sok od pomorandže bez dodatog šećera.",
            "4.00",
          ),
          item(
            "Protein smoothie",
            "Banana, bademovo mlijeko, kikiriki puter i whey protein.",
            "5.00",
          ),
          item(
            "Green Detox smoothie",
            "Spanać, jabuka, banana, đumbir i limun.",
            "4.80",
          ),
          item(
            "Berry Boost smoothie",
            "Šumsko voće, banana, grčki jogurt i chia sjemenke.",
            "4.90",
          ),
        ],
      },
      {
        name: "Proteinski snek",
        items: [
          item(
            "Protein palačinke",
            "Ovsene palačinke sa bananom, whey proteinom i svježim voćem.",
            "5.50",
            true,
          ),
          item(
            "Chia puding",
            "Chia sjemenke, kokosovo mlijeko, voće i granola.",
            "4.50",
          ),
          item(
            "Energy bites",
            "Kuglice od urmi, ovsa, kakaa i kikiriki putera.",
            "3.90",
          ),
        ],
      },
    ],
  },
  {
    name: "Sushi Co",
    slug: "sushi-co",
    logoUrl: "/images/restaurants/sushi-co.jpeg",
    coverImageUrl: null,
    category: "Sushi / Azijska kuhinja",
    rating: 4.7,
    address: "Bulevar Džordža Vašingtona, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 40,
    displayOrder: 6,
    menuCategories: [
      {
        name: "Maki roll-ovi",
        items: [
          item(
            "California Roll 8 kom",
            "Surimi, avokado, krastavac i susam.",
            "6.50",
            true,
          ),
          item(
            "Philadelphia Roll 8 kom",
            "Losos, krem sir i krastavac.",
            "7.50",
            true,
          ),
          item(
            "Losos Avokado Roll 8 kom",
            "Svježi losos, avokado i susam.",
            "7.20",
          ),
          item(
            "Spicy Tuna Roll 8 kom",
            "Tuna, krastavac i pikantni majonez.",
            "7.90",
          ),
          item(
            "Vege Roll 8 kom",
            "Krastavac, avokado, šargarepa i susam.",
            "5.50",
          ),
        ],
      },
      {
        name: "Nigiri",
        items: [
          item("Losos nigiri 2 kom", "Losos preko začinjenog sushi pirinča.", "4.50"),
          item("Tuna nigiri 2 kom", "Tuna preko začinjenog sushi pirinča.", "4.90"),
          item("Ebi nigiri 2 kom", "Kozica preko začinjenog sushi pirinča.", "4.20"),
          item(
            "Avokado nigiri 2 kom",
            "Avokado preko začinjenog sushi pirinča.",
            "3.80",
          ),
        ],
      },
      {
        name: "Combo setovi",
        items: [
          item(
            "Sushi Set za jednog 16 kom",
            "Miks California, Philadelphia i losos rolni.",
            "14.90",
          ),
          item(
            "Premium Set 24 kom",
            "Izbor premium rolni sa lososom, tunom i kozicama.",
            "19.90",
            true,
          ),
          item(
            "Sushi Set za dvoje 32 kom",
            "Veći miks maki roll-ova i nigirija za dvije osobe.",
            "26.90",
          ),
          item(
            "Party Set 48 kom",
            "Kompletan miks maki roll-ova i nigirija za veće društvo.",
            "39.90",
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Miso supa", "Tradicionalna supa sa miso pastom, tofuom i algama.", "3.00"),
          item("Edamame", "Kuvana mlada soja sa morskom solju.", "3.50"),
          item(
            "Wakame salata",
            "Salata od morskih algi sa susamom.",
            "4.20",
          ),
          item(
            "Tempura kozice 4 kom",
            "Četiri hrskave kozice sa sweet chilli sosom.",
            "6.50",
            true,
          ),
        ],
      },
    ],
  },
  {
    name: "Ulix",
    slug: "ulix",
    logoUrl: "/images/restaurants/ulix.jpeg",
    coverImageUrl: null,
    category: "Mediteranska kuhinja",
    rating: 4.6,
    address: "Moskovska 2, Podgorica",
    city: "Podgorica",
    deliveryTimeMin: 40,
    displayOrder: 7,
    menuCategories: [
      {
        name: "Predjela",
        items: [
          item(
            "Grčka salata",
            "Paradajz, krastavac, feta sir, Kalamata masline, paprika i crveni luk.",
            "5.50",
            true,
          ),
          item(
            "Tzatziki sa pitom",
            "Grčki jogurt, krastavac, bijeli luk, maslinovo ulje i topla pita.",
            "3.50",
          ),
          item(
            "Dolma",
            "Vinovi listovi punjeni pirinčem i mediteranskim začinskim biljem.",
            "4.50",
          ),
          item(
            "Mediteranski mezze",
            "Humus, tzatziki, masline, feta sir, pečena paprika i pita hljeb.",
            "7.90",
            true,
          ),
        ],
      },
      {
        name: "Glavna jela",
        items: [
          item(
            "Pileći souvlaki tanjir",
            "Pileći ražnjići, pomfrit, grčka salata, tzatziki i pita.",
            "9.50",
            true,
          ),
          item(
            "Svinjski souvlaki tanjir",
            "Svinjski ražnjići, začinjeni krompir, salata, tzatziki i pita.",
            "9.90",
          ),
          item(
            "Grilovana orada",
            "Cijela orada sa žara, mediteransko povrće, maslinovo ulje i limun.",
            "13.90",
            true,
          ),
          item(
            "Musaka",
            "Tradicionalna grčka musaka od patlidžana, krompira, mesa i bešamela.",
            "8.90",
          ),
          item(
            "Pileći gyros tanjir",
            "Pileći gyros u restoranskoj prezentaciji sa salatom, pitom i tzatzikijem.",
            "9.90",
          ),
          item(
            "Mediteranska pasta sa kozicama",
            "Tjestenina, kozice, cherry paradajz, bijeli luk i maslinovo ulje.",
            "12.50",
            true,
          ),
        ],
      },
      {
        name: "Deserti",
        items: [
          item("Baklava", "Baklava sa orasima i aromatičnim sirupom.", "3.50"),
          item(
            "Grčki jogurt sa medom",
            "Gusti grčki jogurt, med, orasi i cimet.",
            "4.00",
          ),
          item(
            "Portokalopita",
            "Sočni grčki kolač od pomorandže i kora, poslužen sa jogurtom.",
            "4.50",
          ),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Voda 0.5 l", null, "1.50"),
          item("Limunada 0.3 l", null, "2.80"),
          item("Grčko vino čaša 0.15 l", null, "4.50"),
          item("Ouzo 0.05 l", null, "3.00"),
        ],
      },
    ],
  },
];

const withDisplayOrder = (entries) =>
  entries.map((entry, index) => ({
    ...entry,
    displayOrder: index + 1,
  }));

async function seedDeals() {
  await prisma.$transaction(async (transaction) => {
    await transaction.deal.deleteMany();
    await transaction.deal.createMany({ data: deals });
  });
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
}

async function seedRestaurants() {
  for (const { menuCategories, ...restaurantData } of restaurants) {
    await prisma.$transaction(async (transaction) => {
      const restaurant = await transaction.restaurant.upsert({
        where: { slug: restaurantData.slug },
        update: restaurantData,
        create: restaurantData,
      });

      await transaction.menuCategory.deleteMany({
        where: { restaurantId: restaurant.id },
      });

      await transaction.menuCategory.createMany({
        data: withDisplayOrder(menuCategories).map(({ items: _items, ...category }) => ({
          ...category,
          restaurantId: restaurant.id,
        })),
      });

      const persistedCategories = await transaction.menuCategory.findMany({
        where: { restaurantId: restaurant.id },
        select: { id: true, name: true },
      });
      const categoryIdsByName = new Map(
        persistedCategories.map((category) => [category.name, category.id]),
      );

      await transaction.menuItem.createMany({
        data: menuCategories.flatMap((category) => {
          const menuCategoryId = categoryIdsByName.get(category.name);

          if (!menuCategoryId) {
            throw new Error(
              `Failed to persist menu category "${category.name}" for ${restaurant.name}`,
            );
          }

          return withDisplayOrder(category.items).map((menuItem) => ({
            ...menuItem,
            imageUrl: null,
            isAvailable: true,
            menuCategoryId,
          }));
        }),
      });
    });
  }
}

async function main() {
  await seedDeals();
  await seedCategories();
  await seedRestaurants();
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
