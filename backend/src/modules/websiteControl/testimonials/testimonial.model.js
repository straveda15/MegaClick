import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    service: {
      type: String,
      trim: true,
      maxlength: [500, "Service cannot exceed 500 characters"],
      default: "",
    },
    services: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [60, "Location cannot exceed 60 characters"],
    },
    review: {
      type: String,
      required: [true, "Review is required"],
      trim: true,
      minlength: [10, "Review must be at least 10 characters"],
      maxlength: [400, "Review cannot exceed 400 characters"],
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "APPROVED",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Keep 'services' array and 'service' string synchronized
testimonialSchema.pre("validate", function () {
  if (Array.isArray(this.services) && this.services.length > 0) {
    if (!this.service) {
      this.service = this.services.join(", ");
    }
  } else if (this.service && (!this.services || this.services.length === 0)) {
    this.services = this.service
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (!this.service && (!this.services || this.services.length === 0)) {
    throw new Error("At least one service is required");
  }
});

export default mongoose.model("Testimonial", testimonialSchema);