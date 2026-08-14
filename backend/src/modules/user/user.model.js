import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^\+[1-9]\d{7,14}$/, "Please use a valid phone number in E.164 format"],
    },

    password: {
      type: String,
      minlength: 6,
    },

    googleId: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "employee", "production_staff", "dispatch_staff"],
      default: "user",
    },

    operationalRoles: {
      type: [String],
      enum: ["production", "dispatch", "warehouse", "ops_staff"],
      default: [],
    },

    departmentRole: {
      type: String,
      enum: ["hr", "accountant", "manager", "business_analyst", "sales"],
      default: null,
    },

    // Senior Sales Manager ("Sales Head"): a flag layered on top of the Sales
    // department. The member stays in the "sales" departmentRole; this only
    // marks them as the team lead who can distribute leads and see oversight.
    isSalesManager: {
      type: Boolean,
      default: false,
    },

    // Explicit page-level permissions granted to this user.
    // Populated from the Permissions checkbox panel in Team/Staff Management.
    // When non-empty, the frontend auth guard uses these paths instead of
    // the default role-based path map.
    allowedPaths: {
      type: [String],
      default: [],
    },

    currentOperationalRole: {
      type: String,
      enum: ["production", "dispatch", "warehouse", "ops_staff"],
      default: null,
    },

    pin: {
      type: String, // bcrypt-hashed 4–6 digit PIN
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    authProvider: {
      type: [String],
      enum: ["otp", "google", "local"],
      default: ["otp"],
    },

    profilePicture: {
      type: String,
    },
    // True once the user uploads their own photo — prevents Google login
    // from silently overwriting it with the Google account's avatar.
    hasCustomProfilePicture: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"],
    },
    addressLine1: {
      type: String,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["website", "admin_panel"],
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  if (this.isModified("pin") && this.pin) {
    this.pin = await bcrypt.hash(this.pin, 12);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.comparePin = async function (candidatePin) {
  if (!this.pin) return false;
  return await bcrypt.compare(candidatePin, this.pin);
};

userSchema.index({ googleId: 1 });



const User = mongoose.model("User", userSchema);

export default User;