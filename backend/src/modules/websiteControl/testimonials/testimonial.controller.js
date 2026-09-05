import Testimonial from "./testimonial.model.js";

// Yeh wahi exact 4 default testimonials hain
const defaultSeedData = [
  {
    name: "Rajesh Sharma",
    service: "Income Tax Registration",
    location: "Nashik, Maharashtra",
    review: "MegaClick provided exceptional support during our company registration process. Their team handled every document professionally and ensured a hassle-free experience.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Priya Enterprises",
    service: "GST Registration",
    location: "Pune, Maharashtra",
    review: "The entire process was smooth and transparent. We received regular updates and expert guidance throughout the business registration journey.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Amit Patil",
    service: "Trademark Registration",
    location: "Mumbai, Maharashtra",
    review: "Excellent service with outstanding customer support. Every query was answered promptly and the team completed our work on time.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Sneha Kulkarni",
    service: "MSME Registration",
    location: "Nagpur, Maharashtra",
    review: "MegaClick made the documentation process incredibly simple. Their professional approach exceeded our expectations.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
];

// GET ALL (Agar database empty hoga toh automatically ye 4 cards insert kar dega!)
export const getAllTestimonials = async (req, res) => {
  try {
    let count = await Testimonial.countDocuments();
    if (count === 0) {
      await Testimonial.insertMany(defaultSeedData);
    }

    const filter = req.query.all === "true" ? {} : { isActive: true };
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE Testimonial
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: "Created successfully",
      data: testimonial,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Testimonial
export const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};