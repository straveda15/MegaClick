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
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Service must be at least 2 characters"],
      maxlength: [80, "Service cannot exceed 80 characters"],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);