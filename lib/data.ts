import { Product } from "@/types";

export const products: Product[] = [
  // ── ARIRANG ──────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "[ARIRANG] S/S T-Shirt (Charcoal)",
    // Weverse: USD$42.21 — [GLOBAL EXCLUSIVE] S/S T-Shirt (Charcoal)
    price: 42.21,
    image: "/images/products/refined/arirang-tshirt-charcoal-front.webp",
    images: { 
      front: "/images/products/refined/arirang-tshirt-charcoal-front.webp",
      back: "/images/products/refined/arirang-tshirt-charcoal-back-new.jpg" 
    },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 100,
    sizes: ["S", "M", "L", "XL"],
    description: "Official BTS WORLD TOUR [ARIRANG] S/S T-Shirt in Charcoal. Global Exclusive pre-order item.",
  },
  {
    id: 2,
    name: "[ARIRANG] S/S Photo T-Shirt (Black)",
    // Weverse: USD$42.21 — S/S Photo T-Shirt (Black)
    price: 42.21,
    image: "/images/products/refined/arirang-photo-tshirt-black-front.jpg",
    images: { front: "/images/products/refined/arirang-photo-tshirt-black-front.jpg" },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 80,
    sizes: ["S", "M", "L", "XL"],
    description: "Official BTS WORLD TOUR [ARIRANG] S/S Photo T-Shirt in Black with BTS group photo graphic.",
  },
  {
    id: 3,
    name: "[ARIRANG] S/S Tour T-Shirt (Black)",
    // Weverse: USD$46.50 — S/S Tour T-Shirt (Black)
    price: 46.50,
    image: "/images/products/refined/arirang-tour-tshirt-black-front.png",
    images: { 
      front: "/images/products/refined/arirang-tour-tshirt-black-front.png", 
      back: "/images/products/refined/arirang-tour-tshirt-black-back.jpg" 
    },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 0,
    sizes: ["S", "M", "L", "XL"],
    description: "Official BTS WORLD TOUR [ARIRANG] S/S Tour T-Shirt in Black with tour city list on back.",
  },
  {
    id: 4,
    name: "[ARIRANG] S/S Crop T-Shirt (White)",
    // Weverse: USD$35.05 — [GLOBAL EXCLUSIVE] S/S Crop T-Shirt (White)
    price: 35.05,
    image: "/images/crop-tshirt-white-front.jpg",
    images: { front: "/images/crop-tshirt-white-front.jpg", back: "/images/crop-tshirt-white-back.jpg" },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 60,
    sizes: ["S", "M", "L"],
    description: "Official BTS WORLD TOUR [ARIRANG] S/S Crop T-Shirt in White. Global Exclusive pre-order item.",
  },
  {
    id: 5,
    name: "[ARIRANG] Zip-up Hoodie (Charcoal)",
    // Weverse: USD$120.91 — Zip-up Hoodie (Charcoal)
    price: 120.91,
    image: "/images/products/refined/arirang-zip-up-hoodie-charcoal.jpg",
    images: { 
      front: "/images/products/refined/arirang-zip-up-hoodie-charcoal.jpg",
      detail: "/images/products/refined/arirang-zip-up-hoodie-charcoal.jpg" 
    },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 0,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official BTS WORLD TOUR [ARIRANG] Zip-up Hoodie in Charcoal. Features a vintage distressed finish with custom embroidery and a relaxed fit.",
  },
  {
    id: 18,
    name: "[ARIRANG] Zip-up Hoodie (Black)",
    // Weverse: USD$200.00 — Zip-up Hoodie (Black) — as shown in screenshot
    price: 200.00,
    image: "/images/products/arirang-zip-up-hoodie-black.jpg",
    images: { front: "/images/products/arirang-zip-up-hoodie-black.jpg", back: "/images/products/arirang-zip-up-hoodie-black.jpg" },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official BTS WORLD TOUR [ARIRANG] Zip-up Hoodie in Black. Features the iconic \"ARI ARI VEGAS RA NG\" graphic print on the front with star detail along the hood.",
  },
  {
    id: 6,
    name: "[ARIRANG] Hoodie & Pants Set-up (Gray)",
    // Weverse: USD$178.15 — Hoodie & Pants Set-up (Gray)
    price: 178.15,
    image: "/images/hoodie-gray-arirang-front.jpg",
    images: {
      front: "/images/hoodie-gray-arirang-front.jpg",
      back: "/images/hoodie-gray-arirang-back.jpg",
      detail: "/images/pants-gray-front.jpg",
    },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 50,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official BTS WORLD TOUR [ARIRANG] Hoodie & Pants Set-up in Gray. Complete set includes matching hoodie and sweatpants.",
  },
  {
    id: 7,
    name: "[ARIRANG] Wind Jacket (Gray)",
    // Weverse: USD$92.29 — Wind Jacket (Gray)
    price: 92.29,
    image: "/images/wind-jacket-gray-front.jpg",
    images: { front: "/images/wind-jacket-gray-front.jpg", back: "/images/wind-jacket-gray-back.jpg" },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    description: "Official BTS WORLD TOUR [ARIRANG] Wind Jacket in Gray with ARIRANG WORLD TOUR back print.",
  },
  {
    id: 8,
    name: "[ARIRANG] Knit Cardigan (Beige)",
    // Not listed separately on Weverse Tour Merch page — price kept from original listing
    price: 135.22,
    image: "/images/products/refined/arirang-knit-cardigan-beige-front-new.jpg",
    images: { 
      front: "/images/products/refined/arirang-knit-cardigan-beige-front-new.jpg",
      back: "/images/products/refined/arirang-knit-cardigan-beige-back.jpg",
      detail: "/images/products/refined/arirang-knit-cardigan-beige-detail.jpg" 
    },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 25,
    sizes: ["S", "M", "L"],
    description: "Official BTS WORLD TOUR [ARIRANG] Knit Cardigan in Beige with logo and character back.",
  },
  {
    id: 13,
    name: "[ARIRANG] S/S Jersey",
    // Weverse: USD$60.81 — S/S Jersey
    price: 60.81,
    image: "/images/jersey-generic-front.jpg",
    images: { front: "/images/jersey-generic-front.jpg", back: "/images/jersey-rm-back.jpg" },
    badges: ["EXCLUSIVE", "PRE-ORDER"],
    shipping: "Shipped from KR",
    category: "ARIRANG",
    stock: 100,
    sizes: ["S", "M", "L", "XL"],
    description: "Official ARIRANG camo baseball jersey. Available in all 7 member variants: RM 94, JIN 92, SUGA 93, J-HOPE 94, JIMIN 95, V 95, JUNGKOOK 97.",
    memberVariants: [
      { name: "RM", number: "94", image: "/images/jersey-rm-front.jpg" },
      { name: "JIN", number: "92", image: "/images/jersey-jin-front.jpg" },
      { name: "SUGA", number: "93", image: "/images/jersey-suga-front.jpg" },
      { name: "J-HOPE", number: "94", image: "/images/jersey-jhope-front.jpg" },
      { name: "JIMIN", number: "95", image: "/images/jersey-jimin-front.jpg" },
      { name: "V", number: "95", image: "/images/jersey-v-front.jpg" },
      { name: "JUNGKOOK", number: "97", image: "/images/jersey-jungkook-front.jpg" },
    ],
  },
  // ── RUNSEOKJIN ───────────────────────────────────────────────────────────
  {
    id: 9,
    name: "[RUN SEOKJIN] EP.TOUR S/S T-Shirt (Encore Ver.)",
    // Weverse: USD$35.05 — S/S T-Shirt Encore Ver.
    price: 35.05,
    image: "/images/products/refined/run-seokjin-tshirt-encore-front.png",
    images: { 
      front: "/images/products/refined/run-seokjin-tshirt-encore-front.png", 
      detail: "/images/products/refined/run-seokjin-tshirt-encore-detail.jpg" 
    },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "RUNSEOKJIN",
    stock: 70,
    sizes: ["S", "M", "L", "XL"],
    description: "Official #RUNSEOKJIN EP.TOUR S/S T-Shirt (Encore Ver.) with fish can graphic.",
  },
  {
    id: 10,
    name: "[RUN SEOKJIN] EP.TOUR L/S T-Shirt (Encore Ver.)",
    // Weverse: USD$42.21 — L/S T-Shirt Encore Ver.
    price: 42.21,
    image: "/images/tshirt-ls-encore-front.jpg",
    images: { front: "/images/tshirt-ls-encore-front.jpg", back: "/images/tshirt-ls-encore-back.jpg" },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "RUNSEOKJIN",
    stock: 40,
    sizes: ["S", "M", "L", "XL"],
    description: "Official #RUNSEOKJIN EP.TOUR Long Sleeve T-Shirt (Encore Ver.) with STAY TUNED print.",
  },
  {
    id: 11,
    name: "[RUN SEOKJIN] EP.TOUR Coach Jacket",
    // Weverse: USD$85.14 — Coach Jacket
    price: 85.14,
    image: "/images/coach-jacket-front.jpg",
    images: { front: "/images/coach-jacket-front.jpg", back: "/images/coach-jacket-back.jpg" },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "RUNSEOKJIN",
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    description: "Official #RUNSEOKJIN EP.TOUR Coach Jacket with RUN SEOKJIN EP TOUR back print.",
  },
  {
    id: 12,
    name: "[RUN SEOKJIN] EP.TOUR Denim Jacket",
    // Weverse: USD$96.58 — Denim Jacket
    price: 96.58,
    image: "/images/products/refined/run-seokjin-denim-jacket-front.png",
    images: { 
      front: "/images/products/refined/run-seokjin-denim-jacket-front.png",
      back: "/images/products/refined/run-seokjin-denim-jacket-back.jpg"
    },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "RUNSEOKJIN",
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    description: "Official #RUNSEOKJIN EP.TOUR Denim Jacket. Limited edition exclusive item.",
  },
  // ── HOPE ON THE STAGE ────────────────────────────────────────────────────
  {
    id: 14,
    name: "[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)",
    // Weverse: USD$35.05 — S/S T-Shirt (White)
    price: 35.05,
    image: "/images/stripe-polo-front.jpg",
    images: { front: "/images/stripe-polo-front.jpg", back: "/images/stripe-polo-back.jpg" },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "HOPE ON THE STAGE",
    stock: 40,
    sizes: ["S", "M", "L", "XL"],
    description: "Official j-hope Tour 'HOPE ON THE STAGE' S/S T-Shirt in White.",
  },
  {
    id: 15,
    name: "[j-hope] HOPE ON THE STAGE Hoodie (Black)",
    // Weverse: USD$75.12 — Hoodie (Black)
    price: 75.12,
    image: "/images/products/refined/hope-hoodie-black-front.png",
    images: { 
      front: "/images/products/refined/hope-hoodie-black-front.png",
      back: "/images/products/refined/hope-hoodie-black-back.jpg"
    },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "HOPE ON THE STAGE",
    stock: 35,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Official j-hope Tour 'HOPE ON THE STAGE' Hoodie in Black.",
  },
  {
    id: 16,
    name: "[j-hope] HOPE ON THE STAGE Tour T-Shirt (Brown)",
    // Weverse: USD$35.05 — Tour T-Shirt (Brown)
    price: 35.05,
    image: "/images/products/refined/hope-tour-tshirt-brown-front.jpg",
    images: { 
      front: "/images/products/refined/hope-tour-tshirt-brown-front.jpg", 
      detail: "/images/products/refined/hope-tour-tshirt-brown-detail.jpg" 
    },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "HOPE ON THE STAGE",
    stock: 45,
    sizes: ["S", "M", "L", "XL"],
    description: "Official j-hope Tour 'HOPE ON THE STAGE' Tour T-Shirt in Brown.",
  },
  {
    id: 17,
    name: "[j-hope] HOPE ON THE STAGE Stripe PK T-Shirt (Multi)",
    // Not listed on current Weverse page — original price kept
    price: 35.05,
    image: "/images/products/refined/hope-stripe-pk-tshirt-multi.png",
    images: { front: "/images/products/refined/hope-stripe-pk-tshirt-multi.png" },
    badges: ["EXCLUSIVE"],
    shipping: "Shipped from KR",
    category: "HOPE ON THE STAGE",
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    description: "Official j-hope Tour 'HOPE ON THE STAGE' Stripe Polo T-Shirt with HOPE front and HOPE ON THE STAGE back.",
  },
];

export const categories = ["ALL", "ARIRANG", "RUNSEOKJIN", "HOPE ON THE STAGE"];
export const mainTabs = ["'RANG' Pickup", "Album", "Tour Merch", "BT21", "Merch", "LIVE"];
