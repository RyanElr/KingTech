import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });


const products = [
  // USB-C Cables
  {
    name: 'Câble USB-C vers USB-C 100W',
    description: 'Câble USB-C premium avec charge rapide 100W et transfert de données 10Gbps. Gaine en nylon tressé ultra-résistante, connecteurs plaqués or pour une conductivité optimale. Compatible avec tous les appareils USB-C : MacBook, iPad Pro, Samsung Galaxy, Nintendo Switch.',
    price: 14.99,
    compareAtPrice: 24.99,
    category: 'usb-c',
    brand: 'KingTech',
    images: [{ url: '/images/products/usbc-100w.jpg', alt: 'Câble USB-C 100W' }],
    specifications: {
      length: '2m',
      material: 'Nylon tressé',
      connector1: 'USB-C',
      connector2: 'USB-C',
      maxSpeed: '10 Gbps (USB 3.2)',
      maxPower: '100W PD',
      color: 'Noir/Gris',
      warranty: '2 ans'
    },
    stock: 150,
    rating: 4.8,
    reviewCount: 342,
    featured: true
  },
  {
    name: 'Câble USB-C vers USB-A 3.0',
    description: 'Câble USB-C vers USB-A 3.0 pour connecter vos appareils USB-C aux ports USB classiques. Transfert rapide à 5Gbps, charge à 18W. Idéal pour smartphones, tablettes et accessoires.',
    price: 9.99,
    compareAtPrice: 14.99,
    category: 'usb-c',
    brand: 'KingTech',
    images: [{ url: '/images/products/usbc-usba.jpg', alt: 'Câble USB-C vers USB-A' }],
    specifications: {
      length: '1.5m',
      material: 'Nylon tressé',
      connector1: 'USB-C',
      connector2: 'USB-A 3.0',
      maxSpeed: '5 Gbps',
      maxPower: '18W',
      color: 'Noir',
      warranty: '2 ans'
    },
    stock: 200,
    rating: 4.6,
    reviewCount: 218,
    featured: false
  },
  {
    name: 'Câble USB-C Thunderbolt 4',
    description: 'Le câble ultime pour les professionnels. Thunderbolt 4 avec transfert à 40Gbps, charge 100W PD, support vidéo 8K@60Hz. Compatible avec les docks, moniteurs et eGPU Thunderbolt.',
    price: 39.99,
    compareAtPrice: 59.99,
    category: 'usb-c',
    brand: 'KingTech Pro',
    images: [{ url: '/images/products/thunderbolt4.jpg', alt: 'Câble Thunderbolt 4' }],
    specifications: {
      length: '1m',
      material: 'Nylon tressé premium',
      connector1: 'USB-C (Thunderbolt 4)',
      connector2: 'USB-C (Thunderbolt 4)',
      maxSpeed: '40 Gbps',
      maxPower: '100W PD',
      color: 'Noir/Bleu',
      warranty: '3 ans'
    },
    stock: 75,
    rating: 4.9,
    reviewCount: 156,
    featured: true
  },

  // HDMI Cables
  {
    name: 'Câble HDMI 2.1 Ultra HD 8K',
    description: 'Câble HDMI 2.1 certifié pour le gaming et le cinéma en 8K@60Hz ou 4K@120Hz. Support eARC, VRR, ALLM et Dynamic HDR. Parfait pour PS5, Xbox Series X et home cinéma haut de gamme.',
    price: 19.99,
    compareAtPrice: 34.99,
    category: 'hdmi',
    brand: 'KingTech',
    images: [{ url: '/images/products/hdmi-8k.jpg', alt: 'Câble HDMI 2.1 8K' }],
    specifications: {
      length: '2m',
      material: 'PVC premium + blindage triple',
      connector1: 'HDMI 2.1 Type A',
      connector2: 'HDMI 2.1 Type A',
      maxSpeed: '48 Gbps',
      maxPower: 'N/A',
      color: 'Noir',
      warranty: '3 ans'
    },
    stock: 120,
    rating: 4.7,
    reviewCount: 289,
    featured: true
  },
  {
    name: 'Câble HDMI vers DisplayPort 4K',
    description: 'Adaptateur câble HDMI vers DisplayPort pour connecter votre PC ou console à un moniteur DisplayPort. Support 4K@60Hz avec audio passthrough.',
    price: 16.99,
    compareAtPrice: 22.99,
    category: 'hdmi',
    brand: 'KingTech',
    images: [{ url: '/images/products/hdmi-dp.jpg', alt: 'Câble HDMI vers DisplayPort' }],
    specifications: {
      length: '1.8m',
      material: 'PVC + connecteurs plaqués or',
      connector1: 'HDMI 2.0',
      connector2: 'DisplayPort 1.4',
      maxSpeed: '18 Gbps',
      maxPower: 'N/A',
      color: 'Noir',
      warranty: '2 ans'
    },
    stock: 90,
    rating: 4.4,
    reviewCount: 127,
    featured: false
  },
  {
    name: 'Câble Micro HDMI vers HDMI',
    description: 'Câble Micro HDMI (Type D) vers HDMI standard pour caméras, Raspberry Pi et tablettes. Support 4K@30Hz avec retour audio.',
    price: 11.99,
    category: 'hdmi',
    brand: 'KingTech',
    images: [{ url: '/images/products/micro-hdmi.jpg', alt: 'Câble Micro HDMI' }],
    specifications: {
      length: '1.5m',
      material: 'PVC',
      connector1: 'Micro HDMI (Type D)',
      connector2: 'HDMI Type A',
      maxSpeed: '10.2 Gbps',
      maxPower: 'N/A',
      color: 'Noir',
      warranty: '2 ans'
    },
    stock: 180,
    rating: 4.3,
    reviewCount: 95,
    featured: false
  },

  // Lightning Cables
  {
    name: 'Câble Lightning MFi Certifié',
    description: 'Câble Lightning certifié MFi (Made for iPhone) avec charge rapide et sync. Gaine en nylon tressé ultra-durable testée pour 30,000+ flexions. Compatible iPhone, iPad, AirPods.',
    price: 12.99,
    compareAtPrice: 19.99,
    category: 'lightning',
    brand: 'KingTech',
    images: [{ url: '/images/products/lightning-mfi.jpg', alt: 'Câble Lightning MFi' }],
    specifications: {
      length: '1.2m',
      material: 'Nylon tressé',
      connector1: 'Lightning',
      connector2: 'USB-A',
      maxSpeed: '480 Mbps (USB 2.0)',
      maxPower: '12W',
      color: 'Blanc/Argent',
      warranty: '2 ans'
    },
    stock: 250,
    rating: 4.7,
    reviewCount: 456,
    featured: true
  },
  {
    name: 'Câble USB-C vers Lightning 20W',
    description: 'Câble USB-C vers Lightning pour charge rapide 20W sur iPhone 8 et plus récent. Compatible avec les chargeurs USB-C PD. Gaine en silicone souple premium.',
    price: 15.99,
    compareAtPrice: 24.99,
    category: 'lightning',
    brand: 'KingTech',
    images: [{ url: '/images/products/usbc-lightning.jpg', alt: 'Câble USB-C vers Lightning' }],
    specifications: {
      length: '1m',
      material: 'Silicone premium',
      connector1: 'USB-C',
      connector2: 'Lightning',
      maxSpeed: '480 Mbps',
      maxPower: '20W PD',
      color: 'Blanc',
      warranty: '2 ans'
    },
    stock: 180,
    rating: 4.6,
    reviewCount: 312,
    featured: false
  },

  // Ethernet Cables
  {
    name: 'Câble Ethernet Cat 8 Blindé',
    description: 'Câble Ethernet Cat 8 S/FTP pour le gaming, le streaming et le réseau pro. Bande passante 2GHz, débit jusqu\'à 40Gbps. Double blindage pour une protection maximale contre les interférences.',
    price: 17.99,
    compareAtPrice: 29.99,
    category: 'ethernet',
    brand: 'KingTech Pro',
    images: [{ url: '/images/products/cat8.jpg', alt: 'Câble Ethernet Cat 8' }],
    specifications: {
      length: '3m',
      material: 'Cuivre pur + double blindage S/FTP',
      connector1: 'RJ45',
      connector2: 'RJ45',
      maxSpeed: '40 Gbps',
      maxPower: 'PoE+ compatible',
      color: 'Bleu',
      warranty: '5 ans'
    },
    stock: 100,
    rating: 4.8,
    reviewCount: 198,
    featured: true
  },
  {
    name: 'Câble Ethernet Cat 6a Plat',
    description: 'Câble Ethernet Cat 6a au design plat ultra-fin. Parfait pour passer sous les tapis, le long des murs. 10Gbps, compatible PoE. Idéal pour les installations discrètes.',
    price: 12.99,
    category: 'ethernet',
    brand: 'KingTech',
    images: [{ url: '/images/products/cat6a-flat.jpg', alt: 'Câble Ethernet Cat 6a Plat' }],
    specifications: {
      length: '5m',
      material: 'Cuivre CCA + PVC plat',
      connector1: 'RJ45',
      connector2: 'RJ45',
      maxSpeed: '10 Gbps',
      maxPower: 'PoE compatible',
      color: 'Blanc',
      warranty: '3 ans'
    },
    stock: 140,
    rating: 4.5,
    reviewCount: 167,
    featured: false
  },

  // Audio Cables
  {
    name: 'Câble Jack 3.5mm Premium',
    description: 'Câble audio jack 3.5mm mâle-mâle en cuivre OFC pour une qualité sonore cristalline. Connecteurs plaqués or 24K, blindage tressé anti-interférences. Pour casques, enceintes, autoradio.',
    price: 8.99,
    compareAtPrice: 13.99,
    category: 'audio',
    brand: 'KingTech Audio',
    images: [{ url: '/images/products/jack-35.jpg', alt: 'Câble Jack 3.5mm' }],
    specifications: {
      length: '1.5m',
      material: 'Cuivre OFC + nylon tressé',
      connector1: 'Jack 3.5mm mâle',
      connector2: 'Jack 3.5mm mâle',
      maxSpeed: 'Audio Hi-Fi',
      maxPower: 'N/A',
      color: 'Noir/Rouge',
      warranty: '2 ans'
    },
    stock: 300,
    rating: 4.5,
    reviewCount: 234,
    featured: false
  },
  {
    name: 'Câble XLR Professionnel',
    description: 'Câble XLR 3 broches pour microphones, tables de mixage et équipement audio pro. Conducteurs en cuivre OFC, connecteurs Neutrik. Blindage spiralé pour un son parfait sans parasites.',
    price: 22.99,
    compareAtPrice: 34.99,
    category: 'audio',
    brand: 'KingTech Audio',
    images: [{ url: '/images/products/xlr-pro.jpg', alt: 'Câble XLR Professionnel' }],
    specifications: {
      length: '3m',
      material: 'Cuivre OFC + PVC premium',
      connector1: 'XLR 3 broches mâle',
      connector2: 'XLR 3 broches femelle',
      maxSpeed: 'Audio Pro 24bit/192kHz',
      maxPower: 'N/A',
      color: 'Noir',
      warranty: '3 ans'
    },
    stock: 60,
    rating: 4.9,
    reviewCount: 87,
    featured: true
  },
  {
    name: 'Câble Optique Toslink',
    description: 'Câble audio optique numérique Toslink pour une qualité audio sans perte. Fibre optique PMMA pour une transmission parfaite. Compatible TV, barre de son, DAC, ampli.',
    price: 10.99,
    category: 'audio',
    brand: 'KingTech Audio',
    images: [{ url: '/images/products/toslink.jpg', alt: 'Câble Optique Toslink' }],
    specifications: {
      length: '2m',
      material: 'Fibre optique PMMA',
      connector1: 'Toslink',
      connector2: 'Toslink',
      maxSpeed: 'Audio numérique S/PDIF',
      maxPower: 'N/A',
      color: 'Noir',
      warranty: '2 ans'
    },
    stock: 110,
    rating: 4.4,
    reviewCount: 143,
    featured: false
  },

  // Charging Cables
  {
    name: 'Câble de Charge Magnétique 3-en-1',
    description: 'Câble de charge magnétique universel avec 3 embouts interchangeables : USB-C, Lightning, Micro-USB. Connexion magnétique instantanée avec indicateur LED. Rotation 360° pour un branchement facile.',
    price: 18.99,
    compareAtPrice: 29.99,
    category: 'charging',
    brand: 'KingTech',
    images: [{ url: '/images/products/magnetic-3in1.jpg', alt: 'Câble Magnétique 3-en-1' }],
    specifications: {
      length: '2m',
      material: 'Nylon tressé + aimant néodyme',
      connector1: 'USB-A',
      connector2: 'Magnétique (USB-C, Lightning, Micro-USB)',
      maxSpeed: '480 Mbps',
      maxPower: '15W',
      color: 'Noir/Argent',
      warranty: '1 an'
    },
    stock: 200,
    rating: 4.3,
    reviewCount: 378,
    featured: true
  },
  {
    name: 'Câble de Charge Rapide 65W GaN',
    description: 'Câble USB-C optimisé pour les chargeurs GaN 65W. Charge votre MacBook Air en 1h30, votre iPhone en 30min. Certifié USB-IF avec puce E-Marker intégrée.',
    price: 19.99,
    compareAtPrice: 32.99,
    category: 'charging',
    brand: 'KingTech Pro',
    images: [{ url: '/images/products/charge-65w.jpg', alt: 'Câble Charge 65W' }],
    specifications: {
      length: '1.5m',
      material: 'Silicone premium + nylon',
      connector1: 'USB-C',
      connector2: 'USB-C',
      maxSpeed: '480 Mbps',
      maxPower: '65W PD 3.0',
      color: 'Blanc',
      warranty: '2 ans'
    },
    stock: 130,
    rating: 4.7,
    reviewCount: 256,
    featured: false
  },
  {
    name: 'Câble Enrouleur Rétractable USB-C',
    description: 'Câble USB-C rétractable compact pour les voyageurs. Mécanisme d\'enroulement automatique, longueur ajustable de 10cm à 1m. Boîtier en aluminium anodisé.',
    price: 13.99,
    compareAtPrice: 19.99,
    category: 'charging',
    brand: 'KingTech Travel',
    images: [{ url: '/images/products/retractable.jpg', alt: 'Câble Rétractable USB-C' }],
    specifications: {
      length: '1m (rétractable)',
      material: 'TPE + aluminium anodisé',
      connector1: 'USB-A',
      connector2: 'USB-C',
      maxSpeed: '480 Mbps',
      maxPower: '15W',
      color: 'Gris Sidéral',
      warranty: '1 an'
    },
    stock: 95,
    rating: 4.2,
    reviewCount: 134,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'KingTech',
      email: 'admin@kingtech.fr',
      password: 'Admin123!',
      role: 'admin'
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create test user
    const user = await User.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@test.fr',
      password: 'Test1234!',
      role: 'user',
      address: {
        street: '12 Rue de la Paix',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75002',
        country: 'France'
      },
      phone: '06 12 34 56 78'
    });
    console.log(`👤 Test user created: ${user.email}`);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 ${createdProducts.length} products created`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📋 Test credentials:');
    console.log('   Admin: admin@kingtech.fr / Admin123!');
    console.log('   User:  jean@test.fr / Test1234!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
