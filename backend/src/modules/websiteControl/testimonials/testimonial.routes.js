import express from "express";
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonial.controller.js";

const router = express.Router();

router.route("/")
  .get(getAllTestimonials)
  .post(createTestimonial);

router.route("/:id")
  .put(updateTestimonial)
  .delete(deleteTestimonial);

// ⚠️ Yahan 'module.exports = router' KI JAGAH 'export default router' hona chahiye:
export default router;