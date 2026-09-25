import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsData = [
  // Page 2
  {
    catalogPage: 2,
    itemOnPage: 1,
    name: "Shield",
    slug: "shield",
    category: "Fungicides",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Organic plant fungicide / plant protection against fungal disease.",
    packSizes: [],
    primaryColor: "#059669",
    accentColor: "#10b981",
    featured: true
  },
  {
    catalogPage: 2,
    itemOnPage: 2,
    name: "revive",
    slug: "revive-bottle",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#ef4444",
    featured: false
  },
  {
    catalogPage: 2,
    itemOnPage: 3,
    name: "RizoGold",
    slug: "rizogold",
    category: "Specialty Agricultural Products",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#1e293b",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 2,
    itemOnPage: 4,
    name: "Dinogard",
    slug: "dinogard",
    category: "Insecticides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#ea580c",
    featured: false
  },

  // Page 3
  {
    catalogPage: 3,
    itemOnPage: 1,
    name: "YieldMax 19:19:19",
    slug: "yieldmax-19-19-19",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Balanced NPK nutrition.",
    packSizes: [
      { size: "1 kg", price: 158, priceAvailable: true },
      { size: "25 kg", price: 3413, priceAvailable: true }
    ],
    primaryColor: "#ea580c",
    accentColor: "#ca8a04",
    featured: true
  },
  {
    catalogPage: 3,
    itemOnPage: 2,
    name: "Almighty",
    slug: "almighty",
    category: "Insecticides",
    packType: "can",
    brand: "EMERGENE",
    usedFor: "Insecticide for crop pest management (Tolfenpyrad 15% EC shown on pack).",
    packSizes: [],
    primaryColor: "#eab308",
    accentColor: "#dc2626",
    featured: false
  },
  {
    catalogPage: 3,
    itemOnPage: 3,
    name: "Sengen",
    slug: "sengen-granules",
    category: "Specialty Agricultural Products",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Slow-release granule product; exact use not clearly stated in supplied material.",
    packSizes: [],
    primaryColor: "#581c87",
    accentColor: "#7e22ce",
    featured: false
  },
  {
    catalogPage: 3,
    itemOnPage: 4,
    name: "Grovel",
    slug: "grovel",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "TOPGRO",
    usedFor: "Boosts crop growth.",
    packSizes: [
      { size: "100 ml", price: 58, priceAvailable: true },
      { size: "250 ml", price: 110, priceAvailable: true },
      { size: "500 ml", price: 184, priceAvailable: true },
      { size: "1 L", price: 310, priceAvailable: true },
      { size: "5 L", price: 1444, priceAvailable: true }
    ],
    primaryColor: "#15803d",
    accentColor: "#4ade80",
    featured: true
  },

  // Page 4
  {
    catalogPage: 4,
    itemOnPage: 1,
    name: "Shield",
    slug: "shield-plant-guard",
    category: "Fungicides",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Organic plant fungicide / plant protection against fungal disease.",
    packSizes: [],
    primaryColor: "#047857",
    accentColor: "#10b981",
    featured: false
  },
  {
    catalogPage: 4,
    itemOnPage: 2,
    name: "KartapGard",
    slug: "kartapgard",
    category: "Insecticides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Insecticide for crop pest management.",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#f97316",
    featured: false
  },
  {
    catalogPage: 4,
    itemOnPage: 3,
    name: "Proctor",
    slug: "proctor",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Insecticide for crop pest management (Pymetrozine 50% WG).",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#0284c7",
    featured: false
  },
  {
    catalogPage: 4,
    itemOnPage: 4,
    name: "Ankur Top",
    slug: "ankur-top",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Balanced soil nutrition.",
    packSizes: [
      { size: "1 kg", price: 95, priceAvailable: true },
      { size: "5×10 kg", price: 740, priceAvailable: true },
      { size: "25 kg", price: 1759, priceAvailable: true },
      { size: "50 kg", price: 3413, priceAvailable: true }
    ],
    primaryColor: "#047857",
    accentColor: "#f97316",
    featured: true
  },

  // Page 5
  {
    catalogPage: 5,
    itemOnPage: 1,
    name: "Ammol",
    slug: "ammol",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#b91c1c",
    featured: false
  },
  {
    catalogPage: 5,
    itemOnPage: 2,
    name: "Zotan",
    slug: "zotan",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#0369a1",
    featured: false
  },
  {
    catalogPage: 5,
    itemOnPage: 3,
    name: "BoroWin",
    slug: "borowin",
    category: "Micronutrients",
    packType: "bottle",
    brand: "TOPGRO",
    usedFor: "Improves fruit set.",
    packSizes: [
      { size: "100 ml", price: 100, priceAvailable: true },
      { size: "250 ml", price: 210, priceAvailable: true },
      { size: "500 ml", price: 368, priceAvailable: true },
      { size: "1 L", price: 683, priceAvailable: true }
    ],
    primaryColor: "#15803d",
    accentColor: "#22c55e",
    featured: true
  },
  {
    catalogPage: 5,
    itemOnPage: 4,
    name: "noris",
    slug: "noris",
    category: "Herbicides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Weedicide / pre-emergence weed management (Pretilachlor 50% EC).",
    packSizes: [],
    primaryColor: "#0f766e",
    accentColor: "#14b8a6",
    featured: false
  },

  // Page 6
  {
    catalogPage: 6,
    itemOnPage: 1,
    name: "Indigen Super",
    slug: "indigen-super",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#eab308",
    accentColor: "#22c55e",
    featured: false
  },
  {
    catalogPage: 6,
    itemOnPage: 2,
    name: "Liberty",
    slug: "liberty-bottle",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#047857",
    accentColor: "#10b981",
    featured: false
  },
  {
    catalogPage: 6,
    itemOnPage: 3,
    name: "Viraat RG",
    slug: "viraat-rg",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#f97316",
    featured: false
  },
  {
    catalogPage: 6,
    itemOnPage: 4,
    name: "Advent",
    slug: "advent-pouch",
    category: "Fungicides",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Organic fungicide / plant protection.",
    packSizes: [],
    primaryColor: "#be185d",
    accentColor: "#0284c7",
    featured: true
  },

  // Page 7
  {
    catalogPage: 7,
    itemOnPage: 1,
    name: "Amaron",
    slug: "amaron",
    category: "Crop Protection",
    packType: "jar",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 7,
    itemOnPage: 2,
    name: "arise",
    slug: "arise",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Plant growth regulator; product pack indicates soil conditioning / water retention.",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#84cc16",
    featured: false
  },
  {
    catalogPage: 7,
    itemOnPage: 3,
    name: "Titus Gold",
    slug: "titus-gold",
    category: "Specialty Agricultural Products",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#0f172a",
    featured: false
  },
  {
    catalogPage: 7,
    itemOnPage: 4,
    name: "Thalak",
    slug: "thalak",
    category: "Insecticides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Insecticide for crop pest management.",
    packSizes: [],
    primaryColor: "#1d4ed8",
    accentColor: "#2563eb",
    featured: false
  },

  // Page 8
  {
    catalogPage: 8,
    itemOnPage: 1,
    name: "Anmol",
    slug: "anmol-gold",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#b91c1c",
    accentColor: "#f59e0b",
    featured: false
  },
  {
    catalogPage: 8,
    itemOnPage: 2,
    name: "Maxam",
    slug: "maxam",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#c2410c",
    accentColor: "#0284c7",
    featured: false
  },
  {
    catalogPage: 8,
    itemOnPage: 3,
    name: "SenGen",
    slug: "sengen-box",
    category: "Organic / Biological Products",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Plant protector and immunizer.",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 8,
    itemOnPage: 4,
    name: "Quantum Power",
    slug: "quantum-power",
    category: "Organic / Biological Products",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Enhances plant health, nutrient uptake and root growth.",
    packSizes: [],
    primaryColor: "#0f172a",
    accentColor: "#ea580c",
    featured: true
  },

  // Page 9
  {
    catalogPage: 9,
    itemOnPage: 1,
    name: "GroZinc",
    slug: "grozinc",
    category: "Micronutrients",
    packType: "bottle",
    brand: "TOPGRO",
    usedFor: "Quick zinc correction.",
    packSizes: [
      { size: "100 ml", price: 142, priceAvailable: true },
      { size: "250 ml", price: 310, priceAvailable: true },
      { size: "500 ml", price: 578, priceAvailable: true },
      { size: "1 L", price: 1103, priceAvailable: true }
    ],
    primaryColor: "#7e22ce",
    accentColor: "#f97316",
    featured: true
  },
  {
    catalogPage: 9,
    itemOnPage: 2,
    name: "TRIPLE",
    slug: "triple",
    category: "Specialty Agricultural Products",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#16a34a",
    featured: false
  },
  {
    catalogPage: 9,
    itemOnPage: 3,
    name: "YieldMax 13:0:45",
    slug: "yieldmax-13-0-45",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "High potash nutrition.",
    packSizes: [
      { size: "1 kg", price: 194, priceAvailable: true },
      { size: "25 kg", price: 4331, priceAvailable: true }
    ],
    primaryColor: "#0284c7",
    accentColor: "#16a34a",
    featured: true
  },
  {
    catalogPage: 9,
    itemOnPage: 4,
    name: "YieldMax MKP 00:52:34",
    slug: "yieldmax-mkp-00-52-34",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Flowering and fruiting.",
    packSizes: [
      { size: "1 kg", price: 310, priceAvailable: true },
      { size: "25 kg", price: 7219, priceAvailable: true }
    ],
    primaryColor: "#be185d",
    accentColor: "#9d174d",
    featured: true
  },

  // Page 10
  {
    catalogPage: 10,
    itemOnPage: 1,
    name: "Sindhu Gold",
    slug: "sindhu-gold",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#6b21a8",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 10,
    itemOnPage: 2,
    name: "Bloomex",
    slug: "bloomex",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Plant growth regulator (Gibberellic Acid 0.001% shown on pack).",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#e11d48",
    featured: false
  },
  {
    catalogPage: 10,
    itemOnPage: 3,
    name: "Indigen+",
    slug: "indigen-plus",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0f172a",
    accentColor: "#ea580c",
    featured: false
  },
  {
    catalogPage: 10,
    itemOnPage: 4,
    name: "Advent Plant Protector & Immunizer",
    slug: "advent-plant-protector",
    category: "Organic / Biological Products",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Plant protection and immunization.",
    packSizes: [],
    primaryColor: "#0369a1",
    accentColor: "#0284c7",
    featured: false
  },

  // Page 11
  {
    catalogPage: 11,
    itemOnPage: 1,
    name: "Quantum Humic Seaweed Granules",
    slug: "quantum-humic-seaweed-granules",
    category: "Organic / Biological Products",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Promotes root growth, nutrient uptake, yield and soil health.",
    packSizes: [],
    primaryColor: "#9a3412",
    accentColor: "#15803d",
    featured: false
  },
  {
    catalogPage: 11,
    itemOnPage: 2,
    name: "IMIDAAN",
    slug: "imidaan",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Insecticide for crop pest management (Imidacloprid 30.5% SC).",
    packSizes: [],
    primaryColor: "#1d4ed8",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 11,
    itemOnPage: 3,
    name: "Delite",
    slug: "delite",
    category: "Fertilizers & Plant Nutrition",
    packType: "bucket",
    brand: "TOPGRO",
    usedFor: "Complete crop nutrition.",
    packSizes: [
      { size: "100 g", price: 63, priceAvailable: true },
      { size: "250 g", price: 131, priceAvailable: true },
      { size: "500 g", price: 226, priceAvailable: true },
      { size: "1 kg", price: 436, priceAvailable: true },
      { size: "2 kg", price: 851, priceAvailable: true },
      { size: "5 kg", price: 2074, priceAvailable: true }
    ],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: true
  },
  {
    catalogPage: 11,
    itemOnPage: 4,
    name: "Advent-B",
    slug: "advent-b",
    category: "Organic / Biological Products",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#16a34a",
    featured: false
  },

  // Page 12
  {
    catalogPage: 12,
    itemOnPage: 1,
    name: "Calciwin",
    slug: "calciwin",
    category: "Micronutrients",
    packType: "bottle",
    brand: "TOPGRO",
    usedFor: "Strong fruits and pods.",
    packSizes: [
      { size: "100 ml", price: 79, priceAvailable: true },
      { size: "250 ml", price: 147, priceAvailable: true },
      { size: "500 ml", price: 257, priceAvailable: true },
      { size: "1 L", price: 499, priceAvailable: true }
    ],
    primaryColor: "#ea580c",
    accentColor: "#0284c7",
    featured: true
  },
  {
    catalogPage: 12,
    itemOnPage: 2,
    name: "Alcazar",
    slug: "alcazar",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Insecticide / plant protection; exact crop-use claim not stated in supplied material.",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#166534",
    featured: false
  },
  {
    catalogPage: 12,
    itemOnPage: 3,
    name: "Top Zn",
    slug: "top-zn",
    category: "Micronutrients",
    packType: "pouch",
    brand: "TOPGRO",
    usedFor: "Corrects zinc deficiency.",
    packSizes: [
      { size: "100 g", price: 89, priceAvailable: true },
      { size: "250 g", price: 194, priceAvailable: true },
      { size: "500 g", price: 373, priceAvailable: true },
      { size: "1 kg", price: 730, priceAvailable: true }
    ],
    primaryColor: "#9333ea",
    accentColor: "#22c55e",
    featured: true
  },
  {
    catalogPage: 12,
    itemOnPage: 4,
    name: "RoyalGard",
    slug: "royalgard-bottle-1",
    category: "Insecticides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Insecticide for crop pest management (Fipronil 5% SC).",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#1d4ed8",
    featured: false
  },

  // Page 13
  {
    catalogPage: 13,
    itemOnPage: 1,
    name: "RNR Sona",
    slug: "rnr-sona",
    category: "Seeds",
    packType: "bag",
    brand: "MILANO",
    usedFor: "Paddy seed variety.",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: true
  },
  {
    catalogPage: 13,
    itemOnPage: 2,
    name: "ComStar",
    slug: "comstar",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0f766e",
    accentColor: "#dc2626",
    featured: false
  },
  {
    catalogPage: 13,
    itemOnPage: 3,
    name: "BloomStar",
    slug: "bloomstar",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Plant growth regulator (Paclobutrazol 23% SC).",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#16a34a",
    featured: false
  },
  {
    catalogPage: 13,
    itemOnPage: 4,
    name: "Veera",
    slug: "veera-bottle",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#eab308",
    accentColor: "#dc2626",
    featured: false
  },

  // Page 14
  {
    catalogPage: 14,
    itemOnPage: 1,
    name: "Ranger Gold",
    slug: "ranger-gold",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#0284c7",
    featured: false
  },
  {
    catalogPage: 14,
    itemOnPage: 2,
    name: "Quantum Maxx Combo",
    slug: "quantum-maxx-combo",
    category: "Organic / Biological Products",
    packType: "bucket",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 14,
    itemOnPage: 3,
    name: "Advent",
    slug: "advent-bottle",
    category: "Fungicides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Organic fungicide / plant protection.",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#0369a1",
    featured: false
  },
  {
    catalogPage: 14,
    itemOnPage: 4,
    name: "RoyalGard",
    slug: "royalgard-bottle-2",
    category: "Insecticides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Insecticide for crop pest management (Fipronil 5% SC).",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#1d4ed8",
    featured: false
  },

  // Page 15
  {
    catalogPage: 15,
    itemOnPage: 1,
    name: "Kiezer",
    slug: "kiezer",
    category: "Herbicides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Herbicide / weed management (Quizalofop Ethyl 10% EC).",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#dc2626",
    featured: false
  },
  {
    catalogPage: 15,
    itemOnPage: 2,
    name: "ABAMA",
    slug: "abama",
    category: "Insecticides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#1d4ed8",
    accentColor: "#ea580c",
    featured: false
  },
  {
    catalogPage: 15,
    itemOnPage: 3,
    name: "Remedy Top",
    slug: "remedy-top",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Calcium, magnesium and sulphur supply.",
    packSizes: [
      { size: "50 kg", price: 683, priceAvailable: true }
    ],
    primaryColor: "#334155",
    accentColor: "#eab308",
    featured: true
  },
  {
    catalogPage: 15,
    itemOnPage: 4,
    name: "ProGard SP",
    slug: "progard-sp",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#0f766e",
    featured: false
  },

  // Page 16
  {
    catalogPage: 16,
    itemOnPage: 1,
    name: "LUCAS",
    slug: "lucas-bottle",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0f172a",
    accentColor: "#15803d",
    featured: false
  },
  {
    catalogPage: 16,
    itemOnPage: 2,
    name: "Maxima Top",
    slug: "maxima-top",
    category: "Micronutrients",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Corrects zinc deficiency.",
    packSizes: [
      { size: "5 kg", price: 320, priceAvailable: true },
      { size: "10 kg", price: 578, priceAvailable: true }
    ],
    primaryColor: "#dc2626",
    accentColor: "#16a34a",
    featured: true
  },
  {
    catalogPage: 16,
    itemOnPage: 3,
    name: "revive",
    slug: "revive-pouch",
    category: "Plant Growth Regulators",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#ea580c",
    featured: false
  },
  {
    catalogPage: 16,
    itemOnPage: 4,
    name: "Liberty",
    slug: "liberty-pouch",
    category: "Plant Growth Regulators",
    packType: "pouch",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#991b1b",
    accentColor: "#16a34a",
    featured: false
  },

  // Page 17
  {
    catalogPage: 17,
    itemOnPage: 1,
    name: "Ranger",
    slug: "ranger-bottle",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#b91c1c",
    featured: false
  },
  {
    catalogPage: 17,
    itemOnPage: 2,
    name: "REYNOL",
    slug: "reynol",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#4338ca",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 17,
    itemOnPage: 3,
    name: "ANMOL",
    slug: "anmol-bottle-2",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#b91c1c",
    accentColor: "#1e293b",
    featured: false
  },
  {
    catalogPage: 17,
    itemOnPage: 4,
    name: "Acetagard",
    slug: "acetagard",
    category: "Insecticides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#15803d",
    featured: false
  },

  // Page 18
  {
    catalogPage: 18,
    itemOnPage: 1,
    name: "Top Iron",
    slug: "top-iron",
    category: "Micronutrients",
    packType: "box",
    brand: "TOPGRO",
    usedFor: "Prevents iron chlorosis.",
    packSizes: [
      { size: "100 g", price: 110, priceAvailable: true },
      { size: "250 g", price: 226, priceAvailable: true },
      { size: "500 g", price: 431, priceAvailable: true },
      { size: "1 kg", price: 835, priceAvailable: true }
    ],
    primaryColor: "#b91c1c",
    accentColor: "#ef4444",
    featured: true
  },
  {
    catalogPage: 18,
    itemOnPage: 2,
    name: "Glory",
    slug: "glory",
    category: "Plant Growth Regulators",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 18,
    itemOnPage: 3,
    name: "Activa",
    slug: "activa",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 18,
    itemOnPage: 4,
    name: "YODHA 405",
    slug: "yodha-405",
    category: "Seeds",
    packType: "bag",
    brand: "MILANO",
    usedFor: "Research paddy / paddy seed product.",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#1e293b",
    featured: true
  },

  // Page 19
  {
    catalogPage: 19,
    itemOnPage: 1,
    name: "CAPTAIN",
    slug: "captain",
    category: "Specialty Agricultural Products",
    packType: "can",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#854d0e",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 19,
    itemOnPage: 2,
    name: "TITUS",
    slug: "titus-bottle",
    category: "Specialty Agricultural Products",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#991b1b",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 19,
    itemOnPage: 3,
    name: "Quantum Granules",
    slug: "quantum-granules",
    category: "Organic / Biological Products",
    packType: "bucket",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#f97316",
    featured: false
  },
  {
    catalogPage: 19,
    itemOnPage: 4,
    name: "MAZEGARD",
    slug: "mazegard",
    category: "Insecticides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ca8a04",
    accentColor: "#eab308",
    featured: false
  },

  // Page 20
  {
    catalogPage: 20,
    itemOnPage: 1,
    name: "SAMRAT MS 7009",
    slug: "samrat-ms-7009",
    category: "Seeds",
    packType: "bag",
    brand: "MILANO",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#dc2626",
    accentColor: "#ea580c",
    featured: false
  },
  {
    catalogPage: 20,
    itemOnPage: 2,
    name: "YieldMax SOP 00:00:50",
    slug: "yieldmax-sop-00-00-50",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Premium potash source.",
    packSizes: [
      { size: "1 kg", price: 163, priceAvailable: true },
      { size: "25 kg", price: 3544, priceAvailable: true }
    ],
    primaryColor: "#0f766e",
    accentColor: "#047857",
    featured: true
  },
  {
    catalogPage: 20,
    itemOnPage: 3,
    name: "THIOMET",
    slug: "thiomet",
    category: "Fungicides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Fungicide (Thiophanate Methyl 70% WP).",
    packSizes: [],
    primaryColor: "#047857",
    accentColor: "#059669",
    featured: false
  },
  {
    catalogPage: 20,
    itemOnPage: 4,
    name: "JUDO",
    slug: "judo",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#65a30d",
    featured: false
  },

  // Page 21
  {
    catalogPage: 21,
    itemOnPage: 1,
    name: "YieldMax Calcium Nitrate",
    slug: "yieldmax-calcium-nitrate",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Calcium and nitrogen supply.",
    packSizes: [
      { size: "1 kg", price: 126, priceAvailable: true },
      { size: "25 kg", price: 2620, priceAvailable: true }
    ],
    primaryColor: "#0284c7",
    accentColor: "#0369a1",
    featured: true
  },
  {
    catalogPage: 21,
    itemOnPage: 2,
    name: "BORO TOP",
    slug: "boro-top",
    category: "Micronutrients",
    packType: "pouch",
    brand: "TOPGRO",
    usedFor: "Better flower and fruit set.",
    packSizes: [
      { size: "100 g", price: 63, priceAvailable: true },
      { size: "250 g", price: 131, priceAvailable: true },
      { size: "500 g", price: 247, priceAvailable: true },
      { size: "1 kg", price: 473, priceAvailable: true }
    ],
    primaryColor: "#15803d",
    accentColor: "#ca8a04",
    featured: true
  },
  {
    catalogPage: 21,
    itemOnPage: 3,
    name: "Liberty Gold",
    slug: "liberty-gold",
    category: "Plant Growth Regulators",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 21,
    itemOnPage: 4,
    name: "VEERA SP",
    slug: "veera-sp",
    category: "Insecticides",
    packType: "bottle",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#0f172a",
    accentColor: "#0284c7",
    featured: false
  },

  // Page 22
  {
    catalogPage: 22,
    itemOnPage: 1,
    name: "LUCAS Gold",
    slug: "lucas-gold",
    category: "Specialty Agricultural Products",
    packType: "box",
    brand: "EMERGENE",
    usedFor: "Information not available",
    packSizes: [],
    primaryColor: "#ea580c",
    accentColor: "#991b1b",
    featured: false
  },
  {
    catalogPage: 22,
    itemOnPage: 2,
    name: "WEED WIPER",
    slug: "weed-wiper",
    category: "Herbicides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Weedicide / weed management.",
    packSizes: [],
    primaryColor: "#15803d",
    accentColor: "#eab308",
    featured: false
  },
  {
    catalogPage: 22,
    itemOnPage: 3,
    name: "Combiguard",
    slug: "combiguard",
    category: "Fungicides",
    packType: "box",
    brand: "AMOOLYA",
    usedFor: "Fungicide (Carbendazim 12% + Mancozeb 63% WP).",
    packSizes: [],
    primaryColor: "#0284c7",
    accentColor: "#ca8a04",
    featured: false
  },
  {
    catalogPage: 22,
    itemOnPage: 4,
    name: "GLUFOSTAR",
    slug: "glufostar",
    category: "Herbicides",
    packType: "bottle",
    brand: "AMOOLYA",
    usedFor: "Weedicide / weed management (Glufosinate Ammonium 13.5% SL).",
    packSizes: [],
    primaryColor: "#eab308",
    accentColor: "#0284c7",
    featured: false
  },

  // Page 23
  {
    catalogPage: 23,
    itemOnPage: 1,
    name: "YieldMax MAP",
    slug: "yieldmax-map",
    category: "Fertilizers & Plant Nutrition",
    packType: "sack",
    brand: "TOPGRO",
    usedFor: "Strong root development.",
    packSizes: [
      { size: "1 kg", price: 273, priceAvailable: true },
      { size: "25 kg", price: 6295, priceAvailable: true }
    ],
    primaryColor: "#ea580c",
    accentColor: "#1e293b",
    featured: true
  }
];

console.log(`Loaded ${productsData.length} products definitions.`);
if (productsData.length !== 85) {
  throw new Error(`Expected exactly 85 products, got ${productsData.length}!`);
}

// Function to generate SVG for a product based on packaging type
function generateProductSVG(p) {
  const brandText = p.brand;
  const primary = p.primaryColor;
  const accent = p.accentColor;
  const name = p.name;
  const category = p.category;

  // Let's create high quality SVG representing the packaging container (bottle, sack, box, pouch, bucket, can, jar)
  let containerGraphic = '';

  if (p.packType === 'sack') {
    // SACK / BAG (Fertilizer sacks like YieldMax, Ankur Top, Remedy Top)
    containerGraphic = `
      <!-- SACK BODY -->
      <g filter="url(#shadow)">
        <path d="M120,90 C120,70 280,70 280,90 L295,390 C295,405 285,415 265,415 L135,415 C115,415 105,405 105,390 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <!-- Top stitched band -->
        <path d="M115,90 L285,90 L280,105 L120,105 Z" fill="${primary}"/>
        <line x1="118" y1="94" x2="282" y2="94" stroke="#ffffff" stroke-dasharray="3,3" stroke-width="1.5"/>
        
        <!-- Brand banner -->
        <rect x="110" y="115" width="180" height="42" fill="#ffffff"/>
        <circle cx="150" cy="136" r="14" fill="#15803d" opacity="0.15"/>
        <path d="M144,142 C146,134 154,130 156,132 C157,134 152,142 144,142 Z" fill="#16a34a"/>
        <text x="170" y="141" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#15803d" letter-spacing="1.5">${brandText}</text>
        
        <!-- Big Brand Arc / Shape -->
        <path d="M108,170 C160,185 240,185 292,170 L294,290 C240,320 160,320 106,290 Z" fill="${primary}"/>
        <path d="M107,240 C160,270 240,270 293,240 L294,290 C240,320 160,320 106,290 Z" fill="${accent}" opacity="0.85"/>
        
        <!-- Product Name on Sack -->
        <text x="200" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 18 ? 16 : (name.length > 12 ? 20 : 23)}" fill="#ffffff" filter="url(#textShadow)">${name}</text>
        
        <!-- Category & Spec badge -->
        <rect x="145" y="325" width="110" height="24" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="200" y="341" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#334155" letter-spacing="0.5">${category}</text>
        
        <!-- Net quantity stamp / barcode icon -->
        <rect x="130" y="365" width="28" height="24" rx="3" fill="#0f172a" opacity="0.08"/>
        <text x="200" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#64748b">ORIGINAL PACKAGING • CERTIFIED</text>
        
        <!-- Bottom seam -->
        <path d="M105,392 L295,392 L290,410 L110,410 Z" fill="${primary}" opacity="0.9"/>
        <line x1="112" y1="401" x2="288" y2="401" stroke="#ffffff" stroke-dasharray="3,3" stroke-width="1.5"/>
      </g>
    `;
  } else if (p.packType === 'bucket') {
    // BUCKET (e.g. Delite, Quantum Granules, Quantum Maxx Combo)
    containerGraphic = `
      <!-- BUCKET -->
      <g filter="url(#shadow)">
        <!-- Rim -->
        <ellipse cx="200" cy="110" rx="95" ry="18" fill="${primary}"/>
        <ellipse cx="200" cy="108" rx="90" ry="14" fill="#ffffff"/>
        
        <!-- Bucket body -->
        <path d="M108,110 L135,395 C136,408 155,415 200,415 C245,415 264,408 265,395 L292,110 Z" fill="${primary}"/>
        <path d="M108,110 C140,126 260,126 292,110 L285,180 C260,195 140,195 115,180 Z" fill="${accent}" opacity="0.4"/>
        
        <!-- Handle attachment lugs -->
        <circle cx="106" cy="140" r="7" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <circle cx="294" cy="140" r="7" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
        <path d="M106,140 C100,50 300,50 294,140" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
        
        <!-- Label on Bucket -->
        <rect x="130" y="170" width="140" height="180" rx="8" fill="#ffffff" filter="url(#insetShadow)"/>
        <rect x="130" y="170" width="140" height="35" rx="8" fill="#f8fafc"/>
        <text x="200" y="193" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#15803d">${brandText}</text>
        
        <rect x="138" y="215" width="124" height="60" rx="6" fill="${primary}"/>
        <text x="200" y="245" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 15 ? 14 : 18}" fill="#ffffff">${name}</text>
        <text x="200" y="265" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#fef08a">QUALITY AGRICULTURAL FORMULA</text>
        
        <!-- Crop icons placeholder -->
        <circle cx="160" cy="305" r="14" fill="#fee2e2"/>
        <circle cx="200" cy="305" r="14" fill="#fef9c3"/>
        <circle cx="240" cy="305" r="14" fill="#dcfce7"/>
        <text x="200" y="340" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#334155">${category}</text>
      </g>
    `;
  } else if (p.packType === 'bottle') {
    // BOTTLE (e.g. Grovel, Calciwin, GroZinc, noris, IMIDAAN, BoroWin, etc.)
    containerGraphic = `
      <!-- BOTTLE -->
      <g filter="url(#shadow)">
        <!-- Cap -->
        <rect x="175" y="60" width="50" height="35" rx="4" fill="${primary}" stroke="#000000" stroke-opacity="0.1"/>
        <line x1="182" y1="65" x2="182" y2="90" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
        <line x1="192" y1="65" x2="192" y2="90" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
        <line x1="208" y1="65" x2="208" y2="90" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
        <line x1="218" y1="65" x2="218" y2="90" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2"/>
        <rect x="170" y="95" width="60" height="8" rx="2" fill="#cbd5e1"/>
        
        <!-- Neck -->
        <path d="M178,103 L178,135 C178,150 145,175 145,200 L145,395 C145,410 160,415 200,415 C240,415 255,410 255,395 L255,200 C255,175 222,150 222,135 L222,103 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        
        <!-- Bottle Shoulder Highlights -->
        <path d="M152,205 C152,185 180,160 185,145" fill="none" stroke="#f1f5f9" stroke-width="6"/>
        
        <!-- Main Body Label -->
        <rect x="146" y="210" width="108" height="175" rx="4" fill="#ffffff"/>
        <rect x="146" y="210" width="108" height="40" fill="${primary}"/>
        
        <text x="200" y="226" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="10" fill="#ffffff" letter-spacing="1">${brandText}</text>
        <text x="200" y="242" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="800" font-size="${name.length > 14 ? 11 : 14}" fill="#ffffff">${name}</text>
        
        <!-- Label graphic element -->
        <rect x="156" y="260" width="88" height="75" rx="4" fill="#f8fafc" stroke="#e2e8f0"/>
        <circle cx="200" cy="295" r="22" fill="${accent}" opacity="0.2"/>
        <path d="M190,305 C190,290 200,285 205,285 C210,285 210,295 205,305 Z" fill="${primary}"/>
        
        <rect x="154" y="345" width="92" height="18" rx="9" fill="${accent}" opacity="0.15"/>
        <text x="200" y="358" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="8" fill="#1e293b">${category}</text>
        
        <text x="200" y="376" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="7" fill="#64748b">CROP PROTECTION &amp; CARE</text>
      </g>
    `;
  } else if (p.packType === 'box') {
    // BOX (e.g. Shield box, Top Iron, Kartapgard, Dinogard, RizoGold, Combiguard)
    containerGraphic = `
      <!-- BOX -->
      <g filter="url(#shadow)">
        <!-- Top fold -->
        <polygon points="135,110 185,80 285,80 235,110" fill="#e2e8f0" stroke="#cbd5e1"/>
        <polygon points="285,80 285,360 235,395 235,110" fill="#cbd5e1" stroke="#94a3b8"/>
        
        <!-- Front face -->
        <rect x="115" y="110" width="120" height="285" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        
        <!-- Header Banner -->
        <rect x="115" y="110" width="120" height="65" fill="${primary}"/>
        <text x="175" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="11" fill="#ffffff" letter-spacing="1.5">${brandText}</text>
        <text x="175" y="156" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 14 ? 12 : 16}" fill="#ffffff">${name}</text>
        
        <!-- Triangle / Shield / Diamond Art on Box -->
        <polygon points="175,190 215,255 135,255" fill="${accent}" opacity="0.3"/>
        <polygon points="175,200 205,250 145,250" fill="${primary}"/>
        <circle cx="175" cy="230" r="12" fill="#ffffff"/>
        <path d="M170,233 L174,237 L182,226" fill="none" stroke="${primary}" stroke-width="2.5" stroke-linecap="round"/>
        
        <!-- Target / Category Banner -->
        <rect x="125" y="280" width="100" height="22" rx="4" fill="#f1f5f9"/>
        <text x="175" y="295" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#1e293b">${category}</text>
        
        <!-- Hazard / Specification Diamond at Bottom -->
        <polygon points="175,325 190,340 175,355 160,340" fill="${accent}"/>
        <text x="175" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="8" fill="#64748b">AGRICULTURAL USE ONLY</text>
      </g>
    `;
  } else if (p.packType === 'pouch') {
    // POUCH (e.g. Shield pouch, Top Zn, BORO TOP, Advent, Quantum Power, Sengen)
    containerGraphic = `
      <!-- POUCH -->
      <g filter="url(#shadow)">
        <!-- Top Notch & Heat Seal -->
        <path d="M120,95 L280,95 L280,120 L275,125 L280,130 L280,385 C280,405 270,415 250,415 L150,415 C130,415 120,405 120,385 L120,130 L125,125 L120,120 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="120" y="95" width="160" height="25" fill="${primary}"/>
        <line x1="120" y1="102" x2="280" y2="102" stroke="#ffffff" stroke-dasharray="2,2" stroke-width="1"/>
        <line x1="120" y1="112" x2="280" y2="112" stroke="#ffffff" stroke-dasharray="2,2" stroke-width="1"/>
        
        <!-- Tear notches -->
        <polygon points="120,125 126,122 126,128" fill="#475569"/>
        <polygon points="280,125 274,122 274,128" fill="#475569"/>
        
        <!-- Graphic Center Circles / Bands -->
        <circle cx="200" cy="235" r="65" fill="${primary}" opacity="0.9"/>
        <circle cx="200" cy="235" r="50" fill="${accent}" opacity="0.8"/>
        <circle cx="200" cy="235" r="35" fill="#ffffff"/>
        
        <!-- Brand Name Top -->
        <text x="200" y="150" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="${primary}" letter-spacing="2">${brandText}</text>
        
        <!-- Product Name -->
        <rect x="135" y="220" width="130" height="32" rx="6" fill="#0f172a" opacity="0.9"/>
        <text x="200" y="242" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 15 ? 13 : 17}" fill="#ffffff">${name}</text>
        
        <!-- Category & Badges -->
        <rect x="145" y="320" width="110" height="24" rx="12" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="200" y="336" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="10" fill="#334155">${category}</text>
        
        <rect x="120" y="390" width="160" height="25" fill="${primary}" opacity="0.85"/>
        <line x1="120" y1="398" x2="280" y2="398" stroke="#ffffff" stroke-dasharray="2,2" stroke-width="1"/>
      </g>
    `;
  } else if (p.packType === 'bag') {
    // SEED BAG (e.g. RNR Sona, YODHA 405, SAMRAT MS 7009)
    containerGraphic = `
      <!-- SEED BAG -->
      <g filter="url(#shadow)">
        <!-- Carrying handle cutout -->
        <path d="M125,85 C125,75 140,70 200,70 C260,70 275,75 275,85 L285,395 C285,410 270,415 200,415 C130,415 115,410 115,395 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="165" y="82" width="70" height="18" rx="9" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
        
        <!-- Seed Brand Header -->
        <path d="M117,115 L283,115 L285,175 L115,175 Z" fill="${primary}"/>
        <circle cx="200" cy="140" r="16" fill="#ffffff" opacity="0.2"/>
        <text x="200" y="145" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#ffffff" letter-spacing="1.5">${brandText}</text>
        
        <!-- Paddy / Seed illustration -->
        <circle cx="200" cy="245" r="55" fill="${accent}" opacity="0.25"/>
        <path d="M185,275 C185,230 215,225 215,215 C215,235 195,245 195,275 Z" fill="${primary}"/>
        <path d="M195,275 C195,240 225,235 225,225 C225,245 205,255 205,275 Z" fill="${accent}"/>
        
        <!-- Variety Name -->
        <rect x="135" y="295" width="130" height="34" rx="6" fill="#0f172a"/>
        <text x="200" y="318" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 14 ? 13 : 16}" fill="#fef08a">${name}</text>
        
        <text x="200" y="355" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#15803d">HIGH GERMINATION • CERTIFIED</text>
        <rect x="150" y="372" width="100" height="20" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="200" y="386" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#334155">${category}</text>
      </g>
    `;
  } else {
    // CAN / JAR (e.g. Almighty, Amaron, CAPTAIN)
    containerGraphic = `
      <!-- CAN / JAR -->
      <g filter="url(#shadow)">
        <!-- Cap / Lid -->
        <ellipse cx="200" cy="85" rx="55" ry="12" fill="${primary}"/>
        <rect x="145" y="85" width="110" height="25" fill="${primary}"/>
        <ellipse cx="200" cy="110" rx="55" ry="12" fill="${accent}"/>
        
        <!-- Can Body -->
        <rect x="130" y="115" width="140" height="280" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <ellipse cx="200" cy="395" rx="70" ry="14" fill="${primary}"/>
        
        <!-- Metallic / Gloss Band -->
        <rect x="131" y="145" width="138" height="220" fill="#ffffff"/>
        <rect x="131" y="145" width="138" height="50" fill="${primary}"/>
        <text x="200" y="176" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="1.5">${brandText}</text>
        
        <text x="200" y="235" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="${name.length > 12 ? 16 : 20}" fill="#0f172a">${name}</text>
        
        <circle cx="200" cy="285" r="28" fill="${accent}" opacity="0.2"/>
        <path d="M190,290 L197,297 L212,278" fill="none" stroke="${primary}" stroke-width="3.5" stroke-linecap="round"/>
        
        <rect x="145" y="330" width="110" height="22" rx="11" fill="#f1f5f9" stroke="#cbd5e1"/>
        <text x="200" y="345" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#334155">${category}</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460" width="100%" height="100%">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.12"/>
    </filter>
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#edf2f7"/>
    </linearGradient>
  </defs>

  <!-- Clean Studio Backdrop -->
  <rect width="400" height="460" fill="url(#bgGrad)"/>
  
  <!-- Subtle floor shadow ellipse -->
  <ellipse cx="200" cy="425" rx="120" ry="18" fill="#0f172a" opacity="0.08"/>

  ${containerGraphic}

  <!-- Catalog Verification Badge -->
  <g transform="translate(15, 15)">
    <rect width="82" height="22" rx="4" fill="#ffffff" opacity="0.9" stroke="#e2e8f0"/>
    <text x="41" y="15" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#047857">CATALOG 2026</text>
  </g>
</svg>`;
}

// Ensure target dir exists
const outputDir = path.resolve(__dirname, '../public/images/products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate image for each product and prepare MongoDB collection records
const masterProducts = productsData.map((p, index) => {
  const imageFileName = `${p.slug}.svg`;
  const imageFilePath = path.join(outputDir, imageFileName);
  const svgContent = generateProductSVG(p);
  fs.writeFileSync(imageFilePath, svgContent, 'utf8');

  // Determine starting price and price available
  const hasPrices = p.packSizes && p.packSizes.length > 0;
  const startingPrice = hasPrices ? Math.min(...p.packSizes.map(ps => ps.price)) : 0;

  // SKU code
  const prefix = p.category.substring(0, 3).toUpperCase();
  const sku = `ET-${prefix}-${String(index + 1).padStart(3, '0')}`;

  return {
    _id: `prod_${String(index + 1).padStart(3, '0')}`,
    name: p.name,
    slug: p.slug,
    category: p.category,
    images: [`/images/products/${imageFileName}`],
    brand: p.brand,
    description: `Authentic ${p.name} from the official Emergene & Topgro 2026 Product Catalogue (Page ${p.catalogPage}). Category: ${p.category}.`,
    usedFor: p.usedFor,
    packSizes: p.packSizes,
    priceAvailable: hasPrices,
    startingPrice: startingPrice,
    stock: 50,
    lowStockThreshold: 10,
    sku: sku,
    featured: p.featured,
    active: true,
    catalogPage: p.catalogPage,
    itemOnPage: p.itemOnPage,
    createdAt: new Date("2026-01-15T08:00:00.000Z"),
    updatedAt: new Date("2026-09-24T08:00:00.000Z")
  };
});

// Write to backend data and frontend data
const backendDataDir = path.resolve(__dirname, '../backend/data');
if (!fs.existsSync(backendDataDir)) {
  fs.mkdirSync(backendDataDir, { recursive: true });
}
fs.writeFileSync(path.join(backendDataDir, 'products.json'), JSON.stringify(masterProducts, null, 2), 'utf8');

const frontendDataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(frontendDataDir)) {
  fs.mkdirSync(frontendDataDir, { recursive: true });
}
fs.writeFileSync(path.join(frontendDataDir, 'products.json'), JSON.stringify(masterProducts, null, 2), 'utf8');

console.log(`Successfully generated SVGs and saved ${masterProducts.length} products to both backend and frontend data stores.`);
