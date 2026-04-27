// All demo data for Rasoi AI

export const VOICE_LINES: Record<string, { user: string; ai: string }[]> = {
  dashboard: [
    { user: "Hey Rasoi, what's the prep status?", ai: "Chef, 3 timers active. Dal Makhani needs attention in 4 minutes. 2 low-stock alerts on masalas — recommend reordering today." },
    { user: "Hey Rasoi, show tonight's best margin dish", ai: "Dal Makhani leads at 75% margin tonight. Naan and Mango Lassi are your silent earners at 77% and 82% respectively." },
  ],
  recipe: [
    { user: "Hey Rasoi, read me the next step", ai: "Step 4: Add ginger-garlic paste and Kashmiri chilli. Bhuno for 5 minutes on medium until the raw smell completely disappears." },
    { user: "Hey Rasoi, substitute for heavy cream?", ai: "For Dal Makhani you can use cashew paste soaked overnight — gives similar richness. Coconut cream works for a vegan version." },
  ],
  techniques: [
    { user: "Hey Rasoi, explain julienne cut", ai: "Julienne: start with 2mm planks, stack them, cut into 2mm strips. Keep knuckles curled as a blade guide. Practice on carrots first." },
    { user: "Hey Rasoi, what's dum cooking?", ai: "Dum means sealed steam cooking. Seal your handi with atta dough, lowest flame, 30–45 minutes. Never open mid-cook — the steam does all the work." },
  ],
  timers: [
    { user: "Hey Rasoi, set biryani dum for 25 minutes", ai: "Timer set — 25 minutes for Biryani Dum. I'll alert you at 5 minutes remaining so you can prepare the finish." },
    { user: "Hey Rasoi, pause the dal timer", ai: "Dal Makhani timer paused at 8 minutes 32 seconds. Say 'resume dal' when you're ready to continue." },
  ],
  inventory: [
    { user: "Hey Rasoi, basmati rice stock?", ai: "Basmati rice: 12kg remaining. At current usage rate that's about 3 days. Thursday is the reorder point — shall I notify Sharma Traders?" },
    { user: "Hey Rasoi, what's critically low?", ai: "Critical: Kashmiri chilli 200g, Ghee 500g. Low: Methi leaves 1 bunch. Want me to place an emergency order with Sharma Spice Co.?" },
  ],
  menu: [
    { user: "Hey Rasoi, most profitable dish?", ai: "Mango Lassi leads at 81.7% margin. For mains, Dal Makhani at 75% is your star. Consider promoting it in tonight's specials board." },
    { user: "Hey Rasoi, price Rogan Josh correctly?", ai: "Rogan Josh costs ₹210 to produce. At ₹720 you're at 70.8% margin. Industry benchmark for this dish is 65–72% — you're well positioned." },
  ],
  staff: [
    { user: "Hey Rasoi, who's on grill tonight?", ai: "Ramesh Kumar is on grill, 5pm to 11pm. He's your most experienced on that station. Priya Sharma on cold section, Suresh on tandoor." },
    { user: "Hey Rasoi, any staff on leave?", ai: "Two staff on leave today — both are prep cooks. Mohan Das is covering both prep stations. May need to start prep 30 minutes earlier." },
  ],
  suppliers: [
    { user: "Hey Rasoi, reorder spices", ai: "Placing order with Sharma Spice Co.: Kashmiri chilli 2kg, Garam masala 1kg, Turmeric 500g. Estimated delivery Tuesday. Confirm?" },
    { user: "Hey Rasoi, when is next dairy delivery?", ai: "Amul Direct delivers tomorrow morning. Local Dairy Farm delivers daily — fresh paneer and curd arrive at 6:30 AM as usual." },
  ],
};

export const SCREEN_TITLES: Record<string, string> = {
  dashboard:  "Dashboard",
  recipe:     "Recipe Studio",
  techniques: "Technique Library",
  timers:     "Kitchen Timers",
  inventory:  "Inventory",
  menu:       "Menu Planning",
  staff:      "Staff Schedule",
  suppliers:  "Suppliers",
};

export interface Recipe {
  id: number;
  name: string;
  hindi: string;
  cat: string;
  time: string;
  serves: number;
  allergens: string[];
  margin: string;
  active: boolean;
  ingredients: { name: string; qty: string; sub: string | null }[];
  steps: { n: number; text: string }[];
}

export const RECIPES: Recipe[] = [
  {
    id: 1, name: "Dal Makhani", hindi: "दाल मखनी", cat: "Main", time: "45 min", serves: 4,
    allergens: ["dairy"], margin: "75%", active: true,
    ingredients: [
      { name: "Black Urad Dal",       qty: "250g",   sub: "Masoor dal works too" },
      { name: "Rajma (Kidney Beans)", qty: "100g",   sub: null },
      { name: "Butter",               qty: "4 tbsp", sub: "Ghee for richer flavour" },
      { name: "Heavy Cream",          qty: "100ml",  sub: "Coconut cream for vegan" },
      { name: "Kashmiri Chilli",      qty: "2 tsp",  sub: "Paprika + regular chilli" },
      { name: "Garam Masala",         qty: "1 tsp",  sub: null },
    ],
    steps: [
      { n: 1, text: "Soak urad dal and rajma overnight. Pressure cook with salt for 6–8 whistles until completely soft and mashable." },
      { n: 2, text: "In a heavy-bottom kadai, melt butter on medium. Add bay leaf, green cardamom, cloves — let spices bloom 30 seconds." },
      { n: 3, text: "Add finely diced onions. Cook on low for 20 full minutes, stirring often, until deep golden — this is your base flavour." },
      { n: 4, text: "Add ginger-garlic paste and Kashmiri chilli powder. Bhuno (sauté) 5 minutes until raw smell completely gone." },
      { n: 5, text: "Add tomato puree. Cook on medium, stirring, until oil starts to separate from the masala — about 12–15 minutes." },
      { n: 6, text: "Add the cooked dal. Mix well and simmer on the lowest flame for 30+ minutes, stirring every 5 minutes. Add water if too thick." },
      { n: 7, text: "Finish with cream, a knob of butter, pinch of garam masala. Garnish with cream swirl and fresh dhania. Serve hot." },
    ],
  },
  {
    id: 2, name: "Butter Chicken", hindi: "मक्खन मुर्गा", cat: "Main", time: "60 min", serves: 4,
    allergens: ["dairy"], margin: "72%", active: false,
    ingredients: [
      { name: "Chicken Thighs",  qty: "800g",   sub: "Breast is leaner option" },
      { name: "Butter",          qty: "5 tbsp", sub: null },
      { name: "Kashmiri Chilli", qty: "3 tsp",  sub: "For deep colour" },
      { name: "Heavy Cream",     qty: "120ml",  sub: "Cashew paste for creaminess" },
      { name: "Kasuri Methi",    qty: "1 tbsp", sub: "Essential — do not skip" },
    ],
    steps: [
      { n: 1, text: "Marinate chicken overnight: yogurt, chilli, garam masala, salt, lemon juice." },
      { n: 2, text: "Grill in tandoor or oven at 230°C until charred edges appear. Rest 5 minutes." },
      { n: 3, text: "Makhani gravy: butter, onion, tomatoes, cashews, spices — cook and blend silky smooth." },
      { n: 4, text: "Simmer gravy, fold in chicken, finish with cream and crushed kasuri methi." },
    ],
  },
  {
    id: 3, name: "Palak Paneer", hindi: "पालक पनीर", cat: "Vegetarian", time: "30 min", serves: 4,
    allergens: ["dairy"], margin: "69%", active: false,
    ingredients: [
      { name: "Palak (Spinach)", qty: "500g", sub: null },
      { name: "Paneer",          qty: "300g", sub: "Firm tofu for vegan" },
      { name: "Cream",           qty: "50ml", sub: "Optional richness" },
    ],
    steps: [
      { n: 1, text: "Blanch spinach 90 seconds. Shock in ice water to preserve bright colour. Blend to smooth puree." },
      { n: 2, text: "Sauté diced onion in ghee until golden. Add ginger, garlic, green chilli." },
      { n: 3, text: "Add tomato, spices. Cook until oil separates. Fold in spinach puree, simmer 8 mins." },
      { n: 4, text: "Add paneer cubes. Simmer 4 mins. Finish with cream, garam masala." },
    ],
  },
];

export interface Technique {
  id: number;
  cat: string;
  name: string;
  hindi: string;
  diff: "Easy" | "Medium" | "Hard";
  desc: string;
  steps: string[];
}

export const TECHS: Technique[] = [
  { id: 1, cat: "Knife Skills",    name: "Julienne",       hindi: "जुलिएन",     diff: "Medium", desc: "2mm × 2mm matchstick cuts. Foundation for stir-fries, salads, and garnishes.", steps: ["Square off vegetable sides for stability","Cut into 5cm-long planks at 2mm thickness","Stack planks and cut into 2mm-wide strips","Curl knuckles — use tip-to-heel knife motion"] },
  { id: 2, cat: "Knife Skills",    name: "Chiffonade",     hindi: "शिफोनेड",   diff: "Easy",   desc: "Fine herb ribbons — basil, mint, curry patta. Prevents bruising delicate leaves.", steps: ["Stack leaves face-down in same direction","Roll tightly into a compact cigar shape","Slice crosswise into thin even ribbons","Use only a sharp knife — dull blades bruise"] },
  { id: 3, cat: "Knife Skills",    name: "Brunoise",       hindi: "ब्रुनोइज़",  diff: "Hard",   desc: "Fine 3mm × 3mm dice. Refined sauces and garnishes at restaurant level.", steps: ["Julienne the vegetable at exactly 3mm","Gather into tight even stacks","Cross-cut precisely at 3mm for cubes","Consistency requires practice — use a ruler"] },
  { id: 4, cat: "Cooking Methods", name: "Dum Cooking",    hindi: "दम पकाना",  diff: "Medium", desc: "Sealed slow-steam cooking. The soul of biryani, korma, and many Mughal dishes.", steps: ["Layer dish in heavy pot (handi preferably)","Seal lid with atta dough to trap all steam","Place on a hot tawa on the lowest flame","Cook 25–45 minutes — never open mid-cook"] },
  { id: 5, cat: "Cooking Methods", name: "Tarka / Tadka",  hindi: "तड़का",      diff: "Easy",   desc: "Blooming spices in hot fat. A critical flavour technique across all Indian cooking.", steps: ["Heat ghee or oil until it shimmers","Add whole spices — jeera, rai, dried chilli","Let them splutter and pop 20–30 seconds","Pour immediately over dal or finished dish"] },
  { id: 6, cat: "Plating",         name: "Sauce Quenelle", hindi: "क्वेनेल",   diff: "Hard",   desc: "Elegant oval scoops of sauce or cream. Elevates plating to fine-dining level.", steps: ["Warm two tablespoons in hot water","Scoop sauce into one warm spoon","Transfer back and forth shaping into an oval","Place gently on plate — minimal contact"] },
  { id: 7, cat: "Plating",         name: "Herb Oil Dots",  hindi: "हर्ब तेल",  diff: "Easy",   desc: "Precision flavoured oil dots for clean modern plating aesthetics.", steps: ["Blend blanched herbs with neutral oil","Strain through fine mesh or muslin","Fill a squeeze bottle with fine tip","Dot in odd numbers for visual balance"] },
  { id: 8, cat: "Cooking Methods", name: "Bhunoing",       hindi: "भूनना",     diff: "Medium", desc: "Intense dry-roasting of masala. The difference between good and great Indian food.", steps: ["Use a heavy-base thick kadai","Add masala paste to hot oil on high heat","Stir constantly — never leave unattended","Cook until oil visibly separates from sides"] },
];

export const STOCK = [
  { id: 1,  name: "Basmati Rice",    hindi: "बासमती चावल",   cat: "Grains",        stock: 12,  unit: "kg",    max: 25, reorder: 8,   supplier: "Sharma Traders"   },
  { id: 2,  name: "Kashmiri Chilli", hindi: "कश्मीरी मिर्च",  cat: "Spices",        stock: 0.2, unit: "kg",    max: 2,  reorder: 0.5, supplier: "Sharma Spice Co." },
  { id: 3,  name: "Ghee",            hindi: "घी",              cat: "Dairy",         stock: 0.5, unit: "kg",    max: 5,  reorder: 1,   supplier: "Amul Direct"      },
  { id: 4,  name: "Paneer",          hindi: "पनीर",            cat: "Dairy",         stock: 3,   unit: "kg",    max: 10, reorder: 3,   supplier: "Local Dairy Farm"  },
  { id: 5,  name: "Urad Dal",        hindi: "उड़द दाल",         cat: "Pulses",        stock: 8,   unit: "kg",    max: 15, reorder: 4,   supplier: "Sharma Traders"   },
  { id: 6,  name: "Methi Leaves",    hindi: "मेथी",            cat: "Fresh Produce", stock: 1,   unit: "bunch", max: 10, reorder: 3,   supplier: "Veg Market"       },
  { id: 7,  name: "Chicken Thighs",  hindi: "चिकन",            cat: "Protein",       stock: 5,   unit: "kg",    max: 20, reorder: 8,   supplier: "Halal Meat Co."   },
  { id: 8,  name: "Garam Masala",    hindi: "गरम मसाला",       cat: "Spices",        stock: 0.8, unit: "kg",    max: 3,  reorder: 0.5, supplier: "Sharma Spice Co." },
  { id: 9,  name: "Tomatoes",        hindi: "टमाटर",           cat: "Fresh Produce", stock: 8,   unit: "kg",    max: 15, reorder: 5,   supplier: "Veg Market"       },
  { id: 10, name: "Heavy Cream",     hindi: "क्रीम",           cat: "Dairy",         stock: 2,   unit: "ltr",   max: 8,  reorder: 2,   supplier: "Amul Direct"      },
];

export const MENU_ITEMS = [
  { name: "Butter Chicken",    cat: "Main",       cost: 185, price: 650, margin: 71.5, sales: 42 },
  { name: "Dal Makhani",       cat: "Main",       cost: 95,  price: 380, margin: 75,   sales: 35 },
  { name: "Palak Paneer",      cat: "Vegetarian", cost: 110, price: 360, margin: 69.4, sales: 28 },
  { name: "Rogan Josh",        cat: "Main",       cost: 210, price: 720, margin: 70.8, sales: 31 },
  { name: "Chicken Biryani",   cat: "Rice",       cost: 195, price: 580, margin: 66.4, sales: 38 },
  { name: "Veg Biryani",       cat: "Rice",       cost: 145, price: 420, margin: 65.5, sales: 22 },
  { name: "Naan",              cat: "Bread",      cost: 18,  price: 80,  margin: 77.5, sales: 95 },
  { name: "Mango Lassi",       cat: "Beverage",   cost: 22,  price: 120, margin: 81.7, sales: 60 },
  { name: "Seekh Kebab (6pc)", cat: "Starter",    cost: 160, price: 480, margin: 66.7, sales: 25 },
  { name: "Raita",             cat: "Side",       cost: 15,  price: 80,  margin: 81.3, sales: 70 },
];

export const STAFF = [
  { name: "Ramesh Kumar", role: "Sous Chef",   station: "Grill",        shifts: ["Mon","Tue","Wed","Thu","Fri"],        avatar: "RK", color: "oklch(62% 0.16 40)"  },
  { name: "Priya Sharma", role: "Line Cook",   station: "Cold Section", shifts: ["Mon","Tue","Thu","Fri","Sat"],        avatar: "PS", color: "oklch(72% 0.14 155)" },
  { name: "Suresh Patel", role: "Tandoor Chef",station: "Tandoor",      shifts: ["Tue","Wed","Thu","Fri","Sat"],        avatar: "SP", color: "oklch(78% 0.18 80)"  },
  { name: "Anita Rao",    role: "Pastry Chef", station: "Pastry",       shifts: ["Mon","Wed","Fri","Sat"],              avatar: "AR", color: "oklch(68% 0.15 290)" },
  { name: "Mohan Das",    role: "Prep Cook",   station: "Prep",         shifts: ["Mon","Tue","Wed","Thu"],              avatar: "MD", color: "oklch(65% 0.18 20)"  },
  { name: "Kavitha Nair", role: "Commis Chef", station: "Veg Section",  shifts: ["Tue","Wed","Thu","Fri","Sat","Sun"], avatar: "KN", color: "oklch(70% 0.14 200)" },
];

export const SUPPLIERS = [
  { id: 1, name: "Sharma Traders",   cat: "Grains & Pulses", contact: "+91 98765 43210", rating: 4.8, lastOrder: "2 days ago", delivery: "Thursday",  items: ["Basmati Rice","Urad Dal","Rajma"],          status: "active"        },
  { id: 2, name: "Sharma Spice Co.", cat: "Spices & Masala", contact: "+91 97654 32109", rating: 4.6, lastOrder: "5 days ago", delivery: "Tuesday",   items: ["Kashmiri Chilli","Garam Masala","Turmeric"], status: "order-placed"  },
  { id: 3, name: "Amul Direct",      cat: "Dairy Products",  contact: "+91 80001 22222", rating: 4.9, lastOrder: "Yesterday",  delivery: "Tomorrow",  items: ["Ghee","Butter","Heavy Cream"],               status: "active"        },
  { id: 4, name: "Local Dairy Farm", cat: "Fresh Dairy",     contact: "+91 99887 65432", rating: 4.7, lastOrder: "Today",      delivery: "Daily",     items: ["Paneer","Curd","Full Cream Milk"],           status: "active"        },
  { id: 5, name: "Halal Meat Co.",   cat: "Protein & Meat",  contact: "+91 76543 21098", rating: 4.5, lastOrder: "3 days ago", delivery: "Wednesday", items: ["Chicken","Mutton","Prawns"],                 status: "active"        },
  { id: 6, name: "Fresh Farms",      cat: "Fresh Produce",   contact: "+91 88776 54321", rating: 4.4, lastOrder: "Today",      delivery: "Daily",     items: ["Tomatoes","Palak","Methi","Coriander"],      status: "active"        },
];
