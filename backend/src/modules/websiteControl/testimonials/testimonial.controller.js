import Testimonial from "./testimonial.model.js";

// Yeh wahi exact 4 default testimonials hain
const defaultSeedData = [
  {
    name: "Rajesh Sharma",
    service: "Income Tax Services",
    services: ["Income Tax Services"],
    location: "Nashik, Maharashtra",
    review: "Filing our corporate Income Tax returns was completely stress-free. The deductions were accurately calculated, compliance was verified thoroughly, and our ITR acknowledgment came through well before the deadline.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Priya Enterprises",
    service: "GST Registration & Filing",
    services: ["GST Registration & Filing"],
    location: "Pune, Maharashtra",
    review: "Our GST registration and monthly return compliance were set up seamlessly. Expert guidance ensured all input tax credit reconciliations were error-free.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Amit Patil",
    service: "Trademark Registration",
    services: ["Trademark Registration"],
    location: "Mumbai, Maharashtra",
    review: "Outstanding legal expertise for our brand trademark registration. All classification searches and application filings were handled with precision and zero delays.",
    rating: 5,
    status: "APPROVED",
    isActive: true,
  },
  {
    name: "Sneha Kulkarni",
    service: "Marriage Registration, Partnership Deed (Notary & Registration of Firm)",
    services: ["Marriage Registration", "Partnership Deed (Notary & Registration of Firm)"],
    location: "Nagpur, Maharashtra",
    review: "Both our marriage registration and partnership deed drafting were completed seamlessly under one roof. The legal documentation was thorough, and the entire process was quick and hassle-free.",
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

// Helper to sync services array and service string
const syncServicesPayload = (body) => {
  const payload = { ...body };
  if (Array.isArray(payload.services) && payload.services.length > 0) {
    if (!payload.service) {
      payload.service = payload.services.join(", ");
    }
  } else if (payload.service && (!payload.services || payload.services.length === 0)) {
    payload.services = payload.service
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return payload;
};

// CREATE Testimonial
export const createTestimonial = async (req, res) => {
  try {
    const payload = syncServicesPayload(req.body);
    const testimonial = await Testimonial.create(payload);
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
    const payload = syncServicesPayload(req.body);
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, payload, {
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