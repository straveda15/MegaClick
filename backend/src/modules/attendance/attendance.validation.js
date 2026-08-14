import Joi from "joi";

// Self-service punch-in (employee via /me/punch-in).
// userId comes from req.user — not accepted in the body.
export const selfPunchInSchema = Joi.object({
  gpsLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).allow(null),
  source: Joi.string().valid("mobile", "web", "dashboard").default("web"),
  isHalfDay: Joi.boolean().default(false),
  // Presence enforced in service (conditional on isHalfDay) with a targeted message.
  halfDayReason: Joi.string().trim().allow("", null),
});

// Self-service punch-out (employee via /me/punch-out).
// When confirmed is absent or false the service returns requiresConfirmation: true
// and the client is expected to show a confirmation screen before re-submitting.
export const selfPunchOutSchema = Joi.object({
  confirmed: Joi.boolean().default(false),
  earlyPunchOutReason: Joi.string().trim().allow("", null),
  earlyPunchOutConfirmed: Joi.boolean().default(false),
  gpsLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).allow(null),
});

// HR/manager-managed punch-in (legacy path, kept for completeness).
export const punchInSchema = Joi.object({
  userId: Joi.string().required(),
  gpsLocation: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
  }).required(),
  source: Joi.string().valid("mobile", "web").default("web"),
});

// HR/manager-managed punch-out (legacy path).
export const punchOutSchema = Joi.object({
  userId: Joi.string().required(),
});

export const attendanceOverrideSchema = Joi.object({
  userId: Joi.string().required(),
  date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required(),
  status: Joi.string().valid("present", "half-day", "absent", "on-leave").required(),
  // Punch times required only when the day is worked (present / half-day).
  punchIn: Joi.date().when("status", {
    is: Joi.valid("present", "half-day"),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  punchOut: Joi.date()
    .greater(Joi.ref("punchIn"))
    .when("status", {
      is: Joi.valid("present", "half-day"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({ "date.greater": "punchOut must be after punchIn" }),
});
