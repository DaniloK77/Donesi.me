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

const podgoricaStreets = [
  {
    name: "Ulica slobode",
    latitude: 42.4432672,
    longitude: 19.2645511,
  },
  {
    name: "Bokeška",
    latitude: 42.4421927,
    longitude: 19.2612084,
  },
  {
    name: "Balšića",
    latitude: 42.4428167,
    longitude: 19.2660761,
  },
  {
    name: "Vučedolska",
    latitude: 42.4410111,
    longitude: 19.2624362,
  },
  {
    name: "Njegoševa",
    latitude: 42.4439138,
    longitude: 19.263056,
  },
  {
    name: "Hercegovačka",
    latitude: 42.4421875,
    longitude: 19.26469,
  },
  {
    name: "Miljana Vukova",
    latitude: 42.4413848,
    longitude: 19.2640347,
  },
  {
    name: "Karađorđeva",
    latitude: 42.4407475,
    longitude: 19.25978,
  },
  {
    name: "Vuka Karadžića",
    latitude: 42.439833,
    longitude: 19.2629392,
  },
  {
    name: "Novaka Miloševa",
    latitude: 42.4397556,
    longitude: 19.2667443,
  },
  {
    name: "Marka Miljanova",
    latitude: 42.4380704,
    longitude: 19.2653384,
  },
  {
    name: "Bulevar Ivana Crnojevića",
    latitude: 42.4438156,
    longitude: 19.262487,
  },
  {
    name: "Bulevar Stanka Dragojevića",
    latitude: 42.440371,
    longitude: 19.2593011,
  },
  {
    name: "Bulevar Svetog Petra Cetinjskog",
    latitude: 42.4379628,
    longitude: 19.2655522,
  },
  {
    name: "Bulevar Revolucije",
    latitude: 42.4402213,
    longitude: 19.2492313,
  },
  {
    name: "Bulevar Džordža Vašingtona",
    latitude: 42.4410637,
    longitude: 19.2442846,
  },
  {
    name: "Bulevar Mihaila Lalića",
    latitude: 42.4465168,
    longitude: 19.2384577,
  },
  {
    name: "V Proleterske brigade",
    latitude: 42.4375419,
    longitude: 19.2673343,
  },
  {
    name: "Bratstva i jedinstva",
    latitude: 42.4356289,
    longitude: 19.2640216,
  },
  {
    name: "Kralja Nikole",
    latitude: 42.4307012,
    longitude: 19.2576194,
  },
  {
    name: "Bulevar Jovana Tomaševića",
    latitude: 42.4415052,
    longitude: 19.2549384,
  },
  {
    name: "Ivana Milutinovića",
    latitude: 42.4376063,
    longitude: 19.2526258,
  },
  {
    name: "13. jula",
    latitude: 42.4459058,
    longitude: 19.2556764,
  },
  {
    name: "4. jula",
    latitude: 42.4272073,
    longitude: 19.259058,
  },
  {
    name: "Svetozara Markovića",
    latitude: 42.4440295,
    longitude: 19.2530343,
  },
  {
    name: "Vasa Raičkovića",
    latitude: 42.4445814,
    longitude: 19.2520115,
  },
  {
    name: "Ivana Vujoševića",
    latitude: 42.4408801,
    longitude: 19.2513327,
  },
  {
    name: "Moskovska",
    latitude: 42.4410149,
    longitude: 19.2471572,
  },
  {
    name: "Cetinjski put",
    latitude: 42.4389453,
    longitude: 19.2372941,
  },
  {
    name: "Bulevar Zetskih vladara",
    latitude: 42.4159916,
    longitude: 19.2522164,
  },
  {
    name: "Bulevar Vilija Branta",
    latitude: 42.4520244,
    longitude: 19.284682,
  },
  {
    name: "I Proleterske",
    latitude: 42.4515729,
    longitude: 19.2852117,
  },
  {
    name: "Nikšićka",
    latitude: 42.435976,
    longitude: 19.2254534,
  },
  {
    name: "Bulevar Josipa Broza Tita",
    latitude: 42.4314372,
    longitude: 19.2731524,
  },
  {
    name: "Studentska",
    latitude: 42.4397036,
    longitude: 19.23656,
  },
  {
    name: "Vaka Đurovića",
    latitude: 42.4467643,
    longitude: 19.2623402,
  },
  {
    name: "Bulevar Save Kovačevića",
    latitude: 42.4313954,
    longitude: 19.2619173,
  },
  {
    name: "Serdara Jola Piletića",
    latitude: 42.4487379,
    longitude: 19.2587094,
  },
  {
    name: "Oktobarske revolucije",
    latitude: 42.4339026,
    longitude: 19.2663075,
  },
  {
    name: "Bulevar knjaza Danila Petrovića",
    latitude: 42.4398471,
    longitude: 19.2397332,
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

const additionalRestaurants = [
  {
    name: "The Big Horn Gastropub",
    slug: "the-big-horn-gastropub",
    logoUrl: "/images/restaurants/big-the-horn.jpeg",
    coverImageUrl: null,
    category: "Američka kuhinja / Burgeri",
    address: "Bulevar Svetog Petra Cetinjskog, Podgorica",
    city: "Podgorica",
    displayOrder: 8,
    menuCategories: [
      {
        name: "Burgeri",
        items: [
          item(
            "Big Horn Classic Burger",
            "Goveđa pljeskavica, čedar, slanina, BBQ sos.",
            "7.50",
            true,
          ),
          item(
            "Smokehouse Burger",
            "Dimljeno meso, karamelizovani luk, dimljeni sir.",
            "8.50",
            true,
          ),
          item(
            "Bourbon BBQ Burger",
            "Goveđa pljeskavica, bourbon BBQ sos, prstenovi luka.",
            "8.90",
            true,
          ),
        ],
      },
      {
        name: "Roštilj / Rebra",
        items: [
          item(
            "Dimljena Rebra (pola porcije)",
            "Sporo dimljena svinjska rebra, BBQ sos.",
            "12.90",
            true,
          ),
          item(
            "Dimljena Rebra (cijela porcija)",
            "Puna porcija rebara.",
            "19.90",
          ),
          item(
            "Pulled Pork Sendvič",
            "Sporo pečena svinjetina, kupus salata, brioš zemička.",
            "8.50",
          ),
        ],
      },
      {
        name: "Prilozi i pića",
        items: [
          item("Slani krompirići", null, "3.00"),
          item("Coleslaw salata", null, "3.50"),
          item("Kraft pivo 0.33 l", null, "3.50"),
        ],
      },
    ],
  },
  {
    name: "Texas Chicken Podgorica",
    slug: "texas-chicken-podgorica",
    logoUrl: "/images/restaurants/texas-chicken.jpeg",
    coverImageUrl: null,
    category: "Fast Food / Burgeri",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 9,
    menuCategories: [
      {
        name: "Piletina",
        items: [
          item(
            "Original Recipe Komad Piletine",
            "Začinjena pohovana piletina po tajnoj recepturi.",
            "3.50",
            true,
          ),
          item("Spicy Tenders (4 kom)", "Ljuti pileći file.", "5.50", true),
          item(
            "Texas Burger",
            "Pileći file, čedar, BBQ sos.",
            "5.20",
            true,
          ),
        ],
      },
      {
        name: "Meniji i prilozi",
        items: [
          item("Family Bucket (8 komada piletine)", null, "16.90", true),
          item("Pomfrit", null, "2.80"),
          item("Coleslaw", null, "2.50"),
        ],
      },
      {
        name: "Pića",
        items: [item("Coca-Cola 0.4 l", null, "2.00")],
      },
    ],
  },
  {
    name: "Fast Food Calimero Roštilj",
    slug: "fast-food-calimero-rostilj",
    logoUrl: "/images/restaurants/calimero-fast-food.jpeg",
    coverImageUrl: null,
    category: "Fast Food / Burgeri",
    address: "Centar, Podgorica",
    city: "Podgorica",
    displayOrder: 10,
    menuCategories: [
      {
        name: "Roštilj",
        items: [
          item(
            "Calimero Miješano Meso (800 g)",
            "Ćevapi, gurmanska pljeskavica, batak, pileće bijelo, bijela vješalica, kobasica, dimljeni vrat, pomfrit i dvije lepinje.",
            "10.00",
            true,
          ),
          item("Ćevapi (5 kom)", null, "3.50", true),
          item("Pileći batak na žaru", null, "3.00", true),
        ],
      },
      {
        name: "Sendviči i salate",
        items: [
          item(
            "Pileći Sendvič",
            "Pileći file, povrće, sos.",
            "3.80",
            true,
          ),
          item("Miješana salata", null, "3.00"),
        ],
      },
    ],
  },
  {
    name: "Konoba The Daltons",
    slug: "konoba-the-daltons",
    logoUrl: "/images/restaurants/the-daltons.jpeg",
    coverImageUrl: "/images/restaurants/the-daltons.jpeg",
    category: "Grčka kuhinja / Girosi",
    address: "Centar, Podgorica",
    city: "Podgorica",
    displayOrder: 11,
    menuCategories: [
      {
        name: "Girosi",
        items: [
          item(
            "Giros Mix (300 g)",
            "Giros pita, 90 g mesa, caciki, pomfrit, paradajz, luk i zelena salata.",
            "2.20",
            true,
          ),
          item(
            "Giros Mix (400 g)",
            "140 g mesa i prilozi.",
            "2.50",
            true,
          ),
          item(
            "Giros Mix (500 g)",
            "180 g mesa i prilozi.",
            "3.20",
          ),
          item(
            "Giros Mix (700 g)",
            "250 g mesa i prilozi, porcija za dvoje.",
            "5.00",
            true,
          ),
        ],
      },
      {
        name: "Burgeri",
        items: [
          item(
            "Daltons Burger (380 g)",
            "Domaća zemička, 80 g junećeg mesa, ljubičasti luk, Daltons sos i ranč sos.",
            "2.50",
            true,
          ),
          item(
            "Daltons Burger (500 g)",
            "160 g junećeg mesa, sir i prilozi.",
            "3.50",
          ),
        ],
      },
      {
        name: "Ostalo",
        items: [
          item(
            "Punjeni ćevap Tanjir (1.3 kg)",
            "Punjeni ćevap, slanina, kobasica, Daltons ražanj, pohovani kačkavalj i pomfrit.",
            "15.00",
          ),
          item(
            "Pljevaljski Kačamak (650 g)",
            "Kukuruzni ili heljdovni kačamak, lisnati sir i mladi skorup.",
            "7.00",
          ),
        ],
      },
    ],
  },
  {
    name: "Fast Food & Gyros Radinović",
    slug: "fast-food-gyros-radinovic",
    logoUrl: "/images/restaurants/radinovic.jpeg",
    coverImageUrl: null,
    category: "Grčka kuhinja / Girosi",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 12,
    menuCategories: [
      {
        name: "Girosi",
        items: [
          item(
            "Klasik Giros (piletina)",
            "Tzatziki, luk, paradajz i pomfrit.",
            "3.00",
            true,
          ),
          item(
            "Klasik Giros (svinjetina)",
            "Tzatziki, luk, paradajz i pomfrit.",
            "3.30",
            true,
          ),
          item(
            "De Lux Giros",
            "Sir, slanina, tzatziki i veća porcija.",
            "4.80",
            true,
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Pomfrit", null, "2.20"),
          item("Grčka salata (mala)", null, "3.00", true),
        ],
      },
      {
        name: "Pića",
        items: [item("Voda 0.5 l", null, "1.50")],
      },
    ],
  },
  {
    name: "The Living Room",
    slug: "the-living-room",
    logoUrl: "/images/restaurants/the-living-room.jpeg",
    coverImageUrl: "/images/restaurants/the-living-room.jpeg",
    category: "Mediteranska kuhinja",
    address: "Capital Plaza, Podgorica",
    city: "Podgorica",
    displayOrder: 13,
    menuCategories: [
      {
        name: "Sharing Plates",
        items: [
          item("Hummus & Pita", "Domaći humus i topla pita.", "5.50", true),
          item(
            "Grčka Salata sa Fetom",
            "Paradajz, krastavac, feta i masline.",
            "6.50",
            true,
          ),
          item(
            "Mediteranski Meze Tanjir",
            "Miks predjela za dijeljenje.",
            "12.90",
            true,
          ),
        ],
      },
      {
        name: "Azijski uticaj",
        items: [
          item("Sushi Selekcija (12 kom)", "Miks roll-ova.", "14.90", true),
          item("Tom Yum Supa", "Ljuto-kisela azijska supa.", "6.90"),
        ],
      },
      {
        name: "Glavna jela",
        items: [
          item(
            "Grilovani Losos sa Povrćem",
            "Svježi losos i sezonsko povrće.",
            "15.90",
          ),
        ],
      },
    ],
  },
  {
    name: "Konoba Lanterna",
    slug: "konoba-lanterna",
    logoUrl: "/images/restaurants/konoba-lanterna.jpeg",
    coverImageUrl: "/images/restaurants/konoba-lanterna.jpeg",
    category: "Mediteranska kuhinja",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 14,
    menuCategories: [
      {
        name: "Predjela",
        items: [
          item(
            "Njeguški Pršut i Sir",
            "Domaći pršut i njeguški sir.",
            "7.50",
            true,
          ),
          item(
            "Punjene Paprike (vegetarijanske)",
            "Pirinač i povrće.",
            "5.50",
            true,
          ),
        ],
      },
      {
        name: "Glavna jela",
        items: [
          item(
            "Riblji Brodet sa Palentom",
            "Tradicionalni crnogorski brodet.",
            "14.90",
            true,
          ),
          item(
            "Teleći Rižoto",
            "Teletina, pečurke i parmezan.",
            "12.50",
            true,
          ),
        ],
      },
      {
        name: "Deserti",
        items: [item("Krempita", null, "3.50")],
      },
    ],
  },
  {
    name: "Nostalgija",
    slug: "nostalgija",
    logoUrl: "/images/restaurants/nostalgija.jpeg",
    coverImageUrl: null,
    category: "Roštilj / Balkanska kuhinja",
    address: "Cetinjski put 36, Podgorica",
    city: "Podgorica",
    displayOrder: 15,
    menuCategories: [
      {
        name: "Roštilj",
        items: [
          item(
            "Roštilj Tanjir (800 g)",
            "Piletina na žaru, svinjski ražnjić, svinjska kremenadla, ćevapi, roštilj kobasica, bijela vješalica, slanina i pomfrit.",
            "15.00",
            true,
          ),
          item(
            "Veliki Roštilj Tanjir (1.4 kg)",
            "Popek, piletina na žaru, bečka i pariska šnicla, svinjski ražnjići, ćevapi, kobasica, punjeni ražnjići, svinjski vrat i pomfrit.",
            "24.90",
            true,
          ),
        ],
      },
      {
        name: "Salate",
        items: [
          item(
            "Zelena Salata Deluxe (400 g)",
            "Piletina, paradajz, krastavac, rukola, grilovane tikvice, šargarepa i kukuruz.",
            "6.50",
            true,
          ),
        ],
      },
    ],
  },
  {
    name: "Picerija Bodiko",
    slug: "picerija-bodiko",
    logoUrl: "/images/restaurants/picerija-bodiko.jpg",
    coverImageUrl: null,
    category: "Roštilj / Balkanska kuhinja",
    address: "Nikšićka 10, Podgorica",
    city: "Podgorica",
    displayOrder: 16,
    menuCategories: [
      {
        name: "Roštilj",
        items: [
          item(
            "Miješano Meso Tanjir (1 kg)",
            "Pet ćevapa, gurmanska pljeskavica, vješalica, pola porcije roštiljske kobasice i pileći i svinjski ražnjić.",
            "14.90",
            true,
          ),
        ],
      },
      {
        name: "Pica",
        items: [
          item("Pelat i Sir", "Osnovna pica.", "1.80", true),
          item(
            "Šunka i Šampinjoni",
            "Pelat, sir, šunka i šampinjoni.",
            "1.80",
            true,
          ),
          item("Kulen Pica", "Pelat, sir i kulen.", "2.30", true),
        ],
      },
      {
        name: "Doručak",
        items: [
          item("Priganice", null, "2.50"),
          item("Omlet sa sirom i šunkom", null, "3.00"),
        ],
      },
    ],
  },
  {
    name: "NAMA Sushi & Coffee",
    slug: "nama-sushi-coffee",
    logoUrl: "/images/restaurants/nama-sushi.png",
    coverImageUrl: null,
    category: "Sushi / Azijska kuhinja",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 17,
    menuCategories: [
      {
        name: "Roll-ovi",
        items: [
          item("Sea Eel Roll", "Ugor, avokado i krastavac.", "8.50", true),
          item("Basic Salmon Roll", "Losos, pirinač i nori.", "6.90", true),
          item("Basic Tuna Roll", "Tuna, pirinač i nori.", "7.20"),
          item(
            "Dragon Roll",
            "Jegulja, avokado i tempura.",
            "9.90",
            true,
          ),
          item(
            "Sushi Wave Roll",
            "Signature roll restorana.",
            "9.50",
            true,
          ),
        ],
      },
      {
        name: "Ostalo",
        items: [
          item(
            "Poke Bowl",
            "Grilovani losos ili tuna, pirinač i povrće.",
            "8.90",
          ),
          item("Ramen", "Azijska supa sa rezancima.", "7.90"),
          item(
            "Bibimbap (govedina ili losos)",
            "Pirinač, povrće i jaje.",
            "9.50",
          ),
          item(
            "Veggie Gyoza",
            "Knedle punjene povrćem.",
            "5.50",
          ),
        ],
      },
    ],
  },
  {
    name: "Sushi Market",
    slug: "sushi-market",
    logoUrl: "/images/deals/sushi-market.png",
    coverImageUrl: null,
    category: "Sushi / Azijska kuhinja",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 18,
    menuCategories: [
      {
        name: "Combo Setovi",
        items: [
          item(
            "Philadelphia Mini Set (46 kom)",
            "Philadelphia, California, maki losos i avokado i vruće rolnice.",
            "24.90",
            true,
          ),
          item(
            "Veliki Party Set (48 kom)",
            "Miks Philadelphia, Geisha, California i Lava rolni.",
            "26.90",
            true,
          ),
          item(
            "Manji Set (40 kom)",
            "Philadelphia classic, gambori, California i Green roll.",
            "21.90",
            true,
          ),
        ],
      },
      {
        name: "Azijska kuhinja",
        items: [
          item(
            "Tom Yum Supa sa Kozicama",
            "Ljuto-kisela tajlandska supa.",
            "6.50",
            true,
          ),
          item(
            "Tom Kha Kai",
            "Piletina, kokosovo mlijeko i čeri paradajz.",
            "6.20",
          ),
        ],
      },
    ],
  },
  {
    name: "Baba Ganuš",
    slug: "baba-ganus",
    logoUrl: "/images/restaurants/babaganus.jpg",
    coverImageUrl: "/images/restaurants/babaganus.jpg",
    category: "Zdrava hrana / Bowl-ovi",
    address: "Podgorica",
    city: "Podgorica",
    displayOrder: 19,
    menuCategories: [
      {
        name: "Bowl-ovi i glavna jela",
        items: [
          item(
            "Veganski Bowl Dana",
            "Kinoa, pečeno povrće, humus i tahini dresing.",
            "6.50",
            true,
          ),
          item(
            "Vegetarijanski Bowl",
            "Pirinač, sočivo, povrće i feta.",
            "6.20",
            true,
          ),
          item(
            "Baba Ganuš Namaz Tanjir",
            "Namaz od patlidžana, humus, pita i povrće.",
            "5.50",
            true,
          ),
        ],
      },
      {
        name: "Sokovi",
        items: [
          item("Svježe cijeđen sok", null, "4.00"),
          item("Zeleni Smoothie", null, "4.50", true),
        ],
      },
    ],
  },
  {
    name: "Zdravo Bio",
    slug: "zdravo-bio",
    logoUrl: "/images/restaurants/zdravo-bio.jpeg",
    coverImageUrl: null,
    category: "Zdrava hrana / Bowl-ovi",
    address: "Marka Radovića 15, Podgorica",
    city: "Podgorica",
    displayOrder: 20,
    menuCategories: [
      {
        name: "Glavna jela",
        items: [
          item(
            "Domaći Bowl sa Farme",
            "Sezonsko povrće, domaći sir i žitarice.",
            "7.50",
            true,
          ),
          item(
            "Salata sa Farme",
            "Domaće povrće i maslinovo ulje.",
            "5.50",
            true,
          ),
          item(
            "Domaća Piletina sa Povrćem",
            "Piletina sa farme i pečeno sezonsko povrće.",
            "9.90",
            true,
          ),
        ],
      },
      {
        name: "Prilozi",
        items: [
          item("Domaći sir", null, "3.00"),
          item("Domaći hljeb", null, "1.50"),
        ],
      },
      {
        name: "Pića",
        items: [
          item("Domaći sok od voća sa farme", null, "3.50", true),
        ],
      },
    ],
  },
];

const restaurantCoordinates = {
  "burger-king": { latitude: 42.44124, longitude: 19.26309 },
  "home-of-gyros": { latitude: 42.43963, longitude: 19.23862 },
  goodfellas: { latitude: 42.44424, longitude: 19.26436 },
  "bbq-more-podgorica": { latitude: 42.43278, longitude: 19.28417 },
  "green-protein": { latitude: 42.44042, longitude: 19.23985 },
  "sushi-co": { latitude: 42.44181, longitude: 19.24591 },
  ulix: { latitude: 42.44522, longitude: 19.24628 },
  "the-big-horn-gastropub": {
    latitude: 42.43897,
    longitude: 19.25491,
  },
  "texas-chicken-podgorica": {
    latitude: 42.44236,
    longitude: 19.26612,
  },
  "fast-food-calimero-rostilj": {
    latitude: 42.44086,
    longitude: 19.26176,
  },
  "konoba-the-daltons": { latitude: 42.44309, longitude: 19.26032 },
  "fast-food-gyros-radinovic": {
    latitude: 42.43931,
    longitude: 19.26671,
  },
  "the-living-room": { latitude: 42.44138, longitude: 19.24427 },
  "konoba-lanterna": { latitude: 42.44461, longitude: 19.25874 },
  nostalgija: { latitude: 42.44013, longitude: 19.23483 },
  "picerija-bodiko": { latitude: 42.44612, longitude: 19.23591 },
  "nama-sushi-coffee": { latitude: 42.43789, longitude: 19.24817 },
  "sushi-market": { latitude: 42.43868, longitude: 19.25811 },
  "baba-ganus": { latitude: 42.44372, longitude: 19.26803 },
  "zdravo-bio": { latitude: 42.43803, longitude: 19.23721 },
};

const seededRestaurants = [...restaurants, ...additionalRestaurants].map(
  (restaurant) => {
    const coordinates = restaurantCoordinates[restaurant.slug];

    if (!coordinates) {
      throw new Error(`Missing coordinates for ${restaurant.name}`);
    }

    return {
      ...restaurant,
      ...coordinates,
    };
  },
  );

const burgerKingReviews = [
  {
    authorName: "St Glx",
    authorLocation: "South London",
    authorImageUrl: null,
    rating: 5,
    comment:
      "The positive aspect was undoubtedly the efficiency of the service. The queue moved quickly, the staff was friendly, and the food was up to the usual standard – hot and satisfying.",
  },
  {
    authorName: "Marko P.",
    authorLocation: "Podgorica",
    authorImageUrl: null,
    rating: 4,
    comment:
      "Hrana je stigla brzo i topla, ambalaža uredna. Jedina zamerka je što je porcija bila malo manja nego što sam očekivao, ali ukus je odličan.",
  },
];

const withDisplayOrder = (entries) =>
  entries.map((entry, index) => ({
    ...entry,
    displayOrder: index + 1,
  }));

const weeklyDiscountPercents = [15, 20, 40];
const discountWeekStart = new Date("2026-07-27T00:00:00.000Z");

function getWeeklyDiscounts(menuCategories, restaurantName) {
  const menuItems = menuCategories.flatMap((category) =>
    category.items.map((menuItem) => ({
      categoryName: category.name,
      menuItem,
    })),
  );
  const candidates = [
    ...menuItems.filter(({ menuItem }) => menuItem.isFeatured),
    ...menuItems.filter(({ menuItem }) => !menuItem.isFeatured),
  ].slice(0, weeklyDiscountPercents.length);

  if (candidates.length !== weeklyDiscountPercents.length) {
    throw new Error(
      `${restaurantName} must have at least three menu items for weekly deals.`,
    );
  }

  return new Map(
    candidates.map(({ categoryName, menuItem }, index) => [
      `${categoryName}\u0000${menuItem.name}`,
      weeklyDiscountPercents[index],
    ]),
  );
}

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

async function seedPodgoricaStreets() {
  await prisma.$transaction(async (transaction) => {
    await transaction.podgoricaStreet.deleteMany();
    await transaction.podgoricaStreet.createMany({
      data: podgoricaStreets,
    });
  });
}

async function seedRestaurants() {
  for (const { menuCategories, ...restaurantData } of seededRestaurants) {
    const weeklyDiscounts = getWeeklyDiscounts(
      menuCategories,
      restaurantData.name,
    );

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
            weeklyDiscountPercent:
              weeklyDiscounts.get(
                `${category.name}\u0000${menuItem.name}`,
              ) ?? null,
            discountWeekStart: weeklyDiscounts.has(
              `${category.name}\u0000${menuItem.name}`,
            )
              ? discountWeekStart
              : null,
            menuCategoryId,
          }));
        }),
      });
    });
  }
}

async function seedReviews() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: "burger-king" },
    select: { id: true },
  });

  if (!restaurant) {
    throw new Error("Burger King must be seeded before its reviews.");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.review.deleteMany({
      where: { restaurantId: restaurant.id },
    });
    await transaction.review.createMany({
      data: burgerKingReviews.map((review) => ({
        ...review,
        restaurantId: restaurant.id,
      })),
    });
  });
}

async function main() {
  await seedDeals();
  await seedCategories();
  await seedPodgoricaStreets();
  await seedRestaurants();
  await seedReviews();
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
