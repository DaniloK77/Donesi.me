const RAW_DRINK_HINTS = [
  "pića",
  "piće",
  "drink",
  "drinks",
  "juice",
  "sok",
  "voda",
  "limunada",
  "beer",
  "pivo",
  "wine",
  "vino",
  "coffee",
  "kafa",
];

const DISABLE_HINTS = [
  "dessert",
  "desert",
  "baklava",
  "krempita",
  "puding",
  "sladoled",
  "soup",
  "supa",
];

const RESTAURANT_PROFILE_OVERRIDES = {
  "burger-king": "fastFood",
  goodfellas: "fastFood",
  "the-big-horn-gastropub": "fastFood",
  "texas-chicken-podgorica": "fastFood",
  "fast-food-calimero-rostilj": "grill",
  "home-of-gyros": "gyros",
  "fast-food-gyros-radinovic": "gyros",
  "konoba-the-daltons": "gyros",
  "sushi-co": "sushi",
  "nama-sushi-coffee": "sushi",
  "sushi-market": "sushi",
  "green-protein": "healthy",
  "baba-ganus": "healthy",
  "zdravo-bio": "healthy",
  ulix: "mediterranean",
  "the-living-room": "mediterranean",
  "konoba-lanterna": "mediterranean",
  "picerija-bodiko": "pizza",
  nostalgija: "grill",
  "bbq-more-podgorica": "grill",
};

const RESTAURANT_PROFILE_HINTS = [
  { profile: "sushi", patterns: ["sushi", "azijska", "japanska"] },
  { profile: "pizza", patterns: ["pizza", "pica", "picerija"] },
  {
    profile: "fastFood",
    patterns: ["fast food", "burger", "burgeri", "sandwich", "sendvic", "sendvici"],
  },
  { profile: "gyros", patterns: ["giros", "girosi", "gyros", "souvlaki"] },
  { profile: "grill", patterns: ["rostilj", "roštilj", "balkanska", "bbq", "grill"] },
  { profile: "healthy", patterns: ["zdrava hrana", "bowl", "vegan", "vege", "salata"] },
  { profile: "mediterranean", patterns: ["mediteranska", "mediterranean", "konoba", "mezze"] },
  { profile: "breakfast", patterns: ["dorucak", "doručak", "breakfast", "brunch"] },
];

const profiles = {
  pizza: {
    maxAddOns: 4,
    groups: [
      {
        id: "pizza-vegetables",
        label: {
          en: "Vegetable add-ons",
          me: "Povrtni dodaci",
        },
        icon: "leaf",
        options: [
          {
            id: "mushrooms",
            label: { en: "Mushrooms", me: "Šampinjoni" },
          },
          {
            id: "onions",
            label: { en: "Onions", me: "Luk" },
          },
          {
            id: "olives",
            label: { en: "Olives", me: "Masline" },
          },
          {
            id: "jalapenos",
            label: { en: "Jalapenos", me: "Jalapenos" },
          },
          {
            id: "tomatoes",
            label: { en: "Tomatoes", me: "Paradajz" },
          },
        ],
      },
      {
        id: "pizza-proteins",
        label: {
          en: "Protein add-ons",
          me: "Mesni dodaci",
        },
        icon: "flame",
        options: [
          {
            id: "ham",
            label: { en: "Ham", me: "Šunka" },
          },
          {
            id: "chicken",
            label: { en: "Chicken", me: "Piletina" },
          },
          {
            id: "salami",
            label: { en: "Salami", me: "Salama" },
          },
          {
            id: "bacon",
            label: { en: "Bacon", me: "Slanina" },
          },
        ],
      },
      {
        id: "pizza-finishes",
        label: {
          en: "Finishing touches",
          me: "Završni dodaci",
        },
        icon: "sauce",
        options: [
          {
            id: "garlic-oil",
            label: { en: "Garlic oil", me: "Bjeli luk ulje" },
          },
          {
            id: "oregano",
            label: { en: "Oregano", me: "Origano" },
          },
          {
            id: "chili-oil",
            label: { en: "Chili oil", me: "Ljuto ulje" },
          },
        ],
      },
    ],
  },
  fastFood: {
    maxAddOns: 3,
    groups: [
      {
        id: "fastfood-extras",
        label: {
          en: "Burger extras",
          me: "Burger dodaci",
        },
        icon: "flame",
        options: [
          { id: "cheese", label: { en: "Cheese", me: "Sir" } },
          { id: "bacon", label: { en: "Bacon", me: "Slanina" } },
          { id: "pickles", label: { en: "Pickles", me: "Kiseli krastavci" } },
          { id: "onions", label: { en: "Onions", me: "Luk" } },
          {
            id: "jalapenos",
            label: { en: "Jalapenos", me: "Jalapenos" },
          },
        ],
      },
      {
        id: "fastfood-sauces",
        label: {
          en: "Sauces",
          me: "Sosovi",
        },
        icon: "sauce",
        options: [
          { id: "mayo", label: { en: "Mayonnaise", me: "Majonez" } },
          { id: "bbq", label: { en: "BBQ sauce", me: "BBQ sos" } },
          { id: "ketchup", label: { en: "Ketchup", me: "Kečap" } },
          { id: "spicy", label: { en: "Spicy sauce", me: "Ljuti sos" } },
        ],
      },
    ],
  },
  sushi: {
    maxAddOns: 3,
    groups: [
      {
        id: "sushi-extras",
        label: {
          en: "Roll extras",
          me: "Dodaci za rolnice",
        },
        icon: "fish",
        options: [
          { id: "avocado", label: { en: "Avocado", me: "Avokado" } },
          { id: "sesame", label: { en: "Sesame", me: "Susam" } },
          { id: "ginger", label: { en: "Ginger", me: "Đumbir" } },
          { id: "wasabi", label: { en: "Wasabi", me: "Wasabi" } },
          { id: "nori", label: { en: "Extra nori", me: "Dodatni nori" } },
        ],
      },
      {
        id: "sushi-sides",
        label: {
          en: "Warm sides",
          me: "Topli prilozi",
        },
        icon: "steam",
        options: [
          { id: "edamame", label: { en: "Edamame", me: "Edamame" } },
          { id: "miso", label: { en: "Miso soup", me: "Miso supa" } },
          { id: "wakame", label: { en: "Wakame salad", me: "Wakame salata" } },
          { id: "tempura", label: { en: "Tempura flakes", me: "Tempura hrskavost" } },
        ],
      },
    ],
  },
  gyros: {
    maxAddOns: 3,
    groups: [
      {
        id: "gyros-toppings",
        label: {
          en: "Gyros toppings",
          me: "Giros dodaci",
        },
        icon: "leaf",
        options: [
          { id: "tzatziki", label: { en: "Tzatziki", me: "Caciki" } },
          { id: "onions", label: { en: "Onions", me: "Luk" } },
          { id: "tomatoes", label: { en: "Tomatoes", me: "Paradajz" } },
          { id: "feta", label: { en: "Feta", me: "Feta" } },
          { id: "fries", label: { en: "Fries inside", me: "Pomfrit u girosu" } },
        ],
      },
      {
        id: "gyros-sides",
        label: {
          en: "Extra sides",
          me: "Dodatni prilozi",
        },
        icon: "bowl",
        options: [
          { id: "pita", label: { en: "Pita bread", me: "Pita hljeb" } },
          { id: "garlic-sauce", label: { en: "Garlic sauce", me: "Bjeli luk sos" } },
          { id: "hot-peppers", label: { en: "Hot peppers", me: "Ljuta paprika" } },
        ],
      },
    ],
  },
  grill: {
    maxAddOns: 3,
    groups: [
      {
        id: "grill-sides",
        label: {
          en: "Traditional sides",
          me: "Tradicionalni prilozi",
        },
        icon: "plate",
        options: [
          { id: "kajmak", label: { en: "Kajmak", me: "Kajmak" } },
          { id: "ajvar", label: { en: "Ajvar", me: "Ajvar" } },
          { id: "somun", label: { en: "Somun", me: "Somun" } },
          { id: "onions", label: { en: "Onions", me: "Luk" } },
        ],
      },
      {
        id: "grill-add-ons",
        label: {
          en: "Extra grill touches",
          me: "Dodatni roštilj dodaci",
        },
        icon: "flame",
        options: [
          { id: "cheese", label: { en: "Cheese", me: "Sir" } },
          { id: "bacon", label: { en: "Bacon", me: "Slanina" } },
          { id: "egg", label: { en: "Egg", me: "Jaje" } },
          { id: "peppers", label: { en: "Grilled peppers", me: "Grilovana paprika" } },
        ],
      },
    ],
  },
  healthy: {
    maxAddOns: 3,
    groups: [
      {
        id: "healthy-boosters",
        label: {
          en: "Boosters",
          me: "Pojačivači",
        },
        icon: "leaf",
        options: [
          { id: "avocado", label: { en: "Avocado", me: "Avokado" } },
          { id: "seeds", label: { en: "Seeds", me: "Sjemenke" } },
          { id: "nuts", label: { en: "Nuts", me: "Orašasti plodovi" } },
          { id: "extra-protein", label: { en: "Extra protein", me: "Dodatni protein" } },
        ],
      },
      {
        id: "healthy-dressings",
        label: {
          en: "Dressings",
          me: "Dresinzi",
        },
        icon: "sauce",
        options: [
          { id: "olive-oil", label: { en: "Olive oil", me: "Maslinovo ulje" } },
          { id: "lemon", label: { en: "Lemon", me: "Limun" } },
          { id: "tahini", label: { en: "Tahini", me: "Tahini" } },
          { id: "yogurt", label: { en: "Yogurt dressing", me: "Jogurt dresing" } },
        ],
      },
    ],
  },
  mediterranean: {
    maxAddOns: 3,
    groups: [
      {
        id: "mediterranean-meze",
        label: {
          en: "Meze extras",
          me: "Meze dodaci",
        },
        icon: "bowl",
        options: [
          { id: "hummus", label: { en: "Hummus", me: "Humus" } },
          { id: "olives", label: { en: "Olives", me: "Masline" } },
          { id: "feta", label: { en: "Feta", me: "Feta" } },
          { id: "pita", label: { en: "Pita", me: "Pita" } },
        ],
      },
      {
        id: "mediterranean-sauces",
        label: {
          en: "Sauces",
          me: "Sosovi",
        },
        icon: "sauce",
        options: [
          { id: "tzatziki", label: { en: "Tzatziki", me: "Caciki" } },
          { id: "garlic-oil", label: { en: "Garlic oil", me: "Bjeli luk ulje" } },
          { id: "herbs", label: { en: "Fresh herbs", me: "Svježe bilje" } },
          { id: "lemon", label: { en: "Lemon", me: "Limun" } },
        ],
      },
    ],
  },
  breakfast: {
    maxAddOns: 2,
    groups: [
      {
        id: "breakfast-extras",
        label: {
          en: "Breakfast extras",
          me: "Doručak dodaci",
        },
        icon: "egg",
        options: [
          { id: "egg", label: { en: "Egg", me: "Jaje" } },
          { id: "cheese", label: { en: "Cheese", me: "Sir" } },
          { id: "ham", label: { en: "Ham", me: "Šunka" } },
          { id: "bacon", label: { en: "Bacon", me: "Slanina" } },
          { id: "mushrooms", label: { en: "Mushrooms", me: "Šampinjoni" } },
        ],
      },
      {
        id: "breakfast-sides",
        label: {
          en: "Sides",
          me: "Prilozi",
        },
        icon: "plate",
        options: [
          { id: "toast", label: { en: "Toast", me: "Tost" } },
          { id: "butter", label: { en: "Butter", me: "Puter" } },
          { id: "jam", label: { en: "Jam", me: "Džem" } },
        ],
      },
    ],
  },
  default: {
    enabled: false,
    maxAddOns: 0,
    groups: [],
  },
};

function stripDiacritics(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function matchesAny(text, values) {
  return values.some((value) => text.includes(value));
}

function getRestaurantBaseProfileKey(restaurant) {
  const override = RESTAURANT_PROFILE_OVERRIDES[restaurant.slug];

  if (override) {
    return override;
  }

  const rawText = `${restaurant.slug} ${restaurant.name} ${restaurant.category}`.toLowerCase();
  const normalizedText = stripDiacritics(rawText);
  const profileHint = RESTAURANT_PROFILE_HINTS.find(({ patterns }) =>
    matchesAny(normalizedText, patterns),
  );

  return profileHint?.profile ?? null;
}

function getProfileKey(restaurant, menuCategory, menuItem) {
  const rawText = `${restaurant.category} ${menuCategory.name} ${menuItem.name} ${menuItem.description ?? ""}`.toLowerCase();
  const normalizedText = stripDiacritics(rawText);

  if (
    matchesAny(rawText, RAW_DRINK_HINTS) ||
    matchesAny(normalizedText, [
      "voda",
      "sok",
      "limunada",
      "pivo",
      "vino",
      "coffee",
      "kafa",
      "water",
      "juice",
    ])
  ) {
    return "default";
  }

  if (matchesAny(normalizedText, DISABLE_HINTS)) {
    return "default";
  }

  if (
    matchesAny(normalizedText, [
      "sushi",
      "maki",
      "roll",
      "nigiri",
      "poke",
      "ramen",
      "gyoza",
      "tempura",
      "wasabi",
      "nori",
    ])
  ) {
    return "sushi";
  }

  if (matchesAny(normalizedText, ["pica", "pizza"])) {
    return "pizza";
  }

  if (
    matchesAny(normalizedText, [
      "burger",
      "fast food",
      "sandwich",
      "sendvic",
      "sendvi",
      "tortila",
      "wrap",
      "nuggets",
      "fries",
      "whopper",
      "royale",
    ])
  ) {
    return "fastFood";
  }

  if (matchesAny(normalizedText, ["giros", "gyros", "souvlaki"])) {
    return "gyros";
  }

  if (
    matchesAny(normalizedText, [
      "rostilj",
      "cevap",
      "pljeskavica",
      "vesalica",
      "raznjici",
      "grill",
      "bbq",
      "rostilj",
    ])
  ) {
    return "grill";
  }

  if (
    matchesAny(normalizedText, [
      "zdrava hrana",
      "bowl",
      "salata",
      "smoothie",
      "protein",
      "falafel",
      "veggie",
      "vege",
      "chia",
      "kinoa",
    ])
  ) {
    return "healthy";
  }

  if (
    matchesAny(normalizedText, [
      "mediteranska",
      "konoba",
      "mezze",
      "hummus",
      "tzatziki",
      "brodet",
      "orada",
      "pasta",
      "souvlaki",
    ])
  ) {
    return "mediterranean";
  }

  if (matchesAny(normalizedText, ["dorucak", "doručak", "omlet", "priganice", "palačinke", "pancake", "eggs"])) {
    return "breakfast";
  }

  const restaurantProfileKey = getRestaurantBaseProfileKey(restaurant);

  if (restaurantProfileKey) {
    return restaurantProfileKey;
  }

  return "default";
}

function cloneGroup(group) {
  return {
    id: group.id,
    label: group.label,
    icon: group.icon,
    options: group.options.map((option) => ({
      id: option.id,
      label: option.label,
      extraPrice: option.extraPrice,
    })),
  };
}

function buildMenuItemCustomization(restaurant, menuCategory, menuItem) {
  const profileKey = getProfileKey(restaurant, menuCategory, menuItem);
  const profile = profiles[profileKey] ?? profiles.default;

  if (profile.enabled === false) {
    return {
      enabled: false,
      profileKey,
      maxAddOns: 0,
      groups: [],
      needsCutleryDefault: false,
      specialRequestMaxLength: 200,
    };
  }

  return {
    enabled: true,
    profileKey,
    maxAddOns: profile.maxAddOns,
    groups: profile.groups.map(cloneGroup),
    needsCutleryDefault: false,
    specialRequestMaxLength: 200,
  };
}

function isValidCustomizationValue(value) {
  return typeof value === "object" && value !== null;
}

function normalizeCustomizationInput(input, customizationDefinition) {
  if (!isValidCustomizationValue(input)) {
    return {
      selectedAddOns: [],
      needsCutlery: false,
      specialRequest: "",
    };
  }

  const selectedAddOns = Array.isArray(input.selectedAddOns)
    ? [...new Set(input.selectedAddOns.filter((value) => typeof value === "string"))]
    : [];

  if (customizationDefinition.enabled && customizationDefinition.groups.length > 0) {
    const allowedIds = new Set(
      customizationDefinition.groups.flatMap((group) =>
        group.options.map((option) => option.id),
      ),
    );

    if (selectedAddOns.length > customizationDefinition.maxAddOns) {
      const error = new Error("Too many add-ons selected.");
      error.code = "CUSTOMIZATION_LIMIT_EXCEEDED";
      throw error;
    }

    const invalidOption = selectedAddOns.find(
      (optionId) => !allowedIds.has(optionId),
    );

    if (invalidOption) {
      const error = new Error("Invalid add-on selected.");
      error.code = "INVALID_CUSTOMIZATION_OPTION";
      throw error;
    }
  }

  const needsCutlery = Boolean(input.needsCutlery);
  const specialRequest =
    typeof input.specialRequest === "string"
      ? input.specialRequest.trim().slice(0, customizationDefinition.specialRequestMaxLength)
      : "";

  return {
    selectedAddOns:
      customizationDefinition.enabled && customizationDefinition.groups.length > 0
        ? selectedAddOns
        : [],
    needsCutlery,
    specialRequest,
  };
}

function buildCustomizationSelectionSummary(
  customizationDefinition,
  selectedAddOns,
) {
  const optionById = new Map(
    customizationDefinition.groups.flatMap((group) =>
      group.options.map((option) => [option.id, option]),
    ),
  );

  return selectedAddOns
    .map((optionId) => {
      const option = optionById.get(optionId);

      if (!option) {
        return null;
      }

      return {
        id: option.id,
        label: option.label,
        extraPrice: option.extraPrice ?? 0,
      };
    })
    .filter(Boolean);
}

module.exports = {
  buildMenuItemCustomization,
  buildCustomizationSelectionSummary,
  normalizeCustomizationInput,
};
