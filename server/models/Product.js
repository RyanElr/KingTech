import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [150, 'Le nom ne peut pas dépasser 150 caractères']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  compareAtPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['usb-c', 'lightning', 'hdmi', 'ethernet', 'audio', 'charging'],
      message: '{VALUE} n\'est pas une catégorie valide'
    },
    index: true
  },
  brand: {
    type: String,
    required: [true, 'La marque est requise'],
    trim: true
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' }
  }],
  specifications: {
    length: { type: String, default: '' },
    material: { type: String, default: '' },
    connector1: { type: String, default: '' },
    connector2: { type: String, default: '' },
    maxSpeed: { type: String, default: '' },
    maxPower: { type: String, default: '' },
    color: { type: String, default: '' },
    warranty: { type: String, default: '2 ans' }
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Auto-generate slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
