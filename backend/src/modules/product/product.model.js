import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // numeric id kept for frontend compatibility
    id: { type: Number },

    sku:  { type: String, unique: true, sparse: true, trim: true },
    slug: { type: String, unique: true, required: true },
    name: { type: String, required: true },

    instagramVideoUrl: { type: String, trim: true },
    instagramVideoThumbnail: { type: String, trim: true },
    instagramVideoDirectUrl: { type: String, trim: true },
    instagramVideoCloudinaryPublicId: { type: String, trim: true },

    hindi: String,
    tag:   String,
    cat:   String,
    desc:  String,

    benefits: [String],

    price: { type: Number, required: true },
    orig:  Number,   // original / crossed-out price

    // Stored in grams for shipment provider selection and rate calculation.
    shippingWeight: { type: Number, min: 0, default: null },

    // Packaged shipping dimensions sent to shipping providers (e.g. Shipmozo).
    // Values are stored as strings with embedded units, e.g. "220gm", "90.2mm", "29cm".
    // Use parseDim() from shipment/utils/shippingDims.js to extract the numeric value.
    shipping: {
      weight: { type: String, default: null },  // e.g. "220gm"
      length: { type: String, default: null },  // e.g. "90.2mm"
      width:  { type: String, default: null },  // e.g. "29cm"
      height: { type: String, default: null },  // e.g. "90.2mm"
    },

    rating:  { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // single product image URL (ImageKit CDN)
    img: String,

    // secondary image shown on card hover (storefront product cards)
    hoverImg: String,

    // multiple gallery images
    gallery: [String],

    // theme / colour tokens used by the frontend
    bgColor:     String,
    textColor:   String,
    accentColor: String,
    circleColor: String,

    theme: {
      dark: {
        base:      String,
        accent:    String,
        glow:      Number,
        heroGlow:  Number,
      },
      light: {
        bg:          String,
        panel:       String,
        elevated:    String,
        accent:      String,
        accentSoft:  String,
      },
    },

    // rich marketing content
    story: { type: mongoose.Schema.Types.Mixed },

    // customer reviews array (mixed shape)
    customerReviews: [mongoose.Schema.Types.Mixed],

    // Inventory / catalogue flags
    stock:       { type: Number, default: 0 },
    stockStatus: { type: String, enum: ["available", "out_of_stock"], default: "available" },
    isFeatured:  { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },

    // Production Recipe (Bill of Materials)
    recipe: {
      powderGrams: { type: Number, default: 0 },
      powderVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      spoonsNeeded: { type: Number, default: 0 },
      spoonVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      jarsNeeded: { type: Number, default: 1 },
      jarVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      sideLabelsNeeded: { type: Number, default: 0 },
      sideLabelVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      upperLabelsNeeded: { type: Number, default: 0 },
      upperLabelVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
      outerBoxesNeeded: { type: Number, default: 0 },
      outerBoxVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
