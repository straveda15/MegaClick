import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn, ShieldCheck, Briefcase } from "lucide-react";

type LoginMode = "admin" | "employee";

// Per-country phone constraints — used to cap input length, drive the
// placeholder hint, and validate at submit time.
const PHONE_RULES: Record<string, { length: number; hint: string; placeholder: string }> = {
  IN: { length: 10, hint: "10-digit mobile number", placeholder: "9876543210" },
  US: { length: 10, hint: "10-digit number", placeholder: "5551234567" },
  GB: { length: 10, hint: "10-digit number", placeholder: "7912345678" },
  AE: { length: 9,  hint: "9-digit mobile number", placeholder: "501234567" },
};

const sanitizeDigits = (raw: string, max: number) =>
  raw.replace(/\D/g, "").slice(0, max);

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<LoginMode>("admin");

  // Shared
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin-specific (can login via phone OR email)
  const [adminIdentifierType, setAdminIdentifierType] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [adminEmail, setAdminEmail] = useState("");

  // Employee-specific (can login via phone OR email)
  const [employeeIdentifierType, setEmployeeIdentifierType] = useState<"phone" | "email">("phone");
  const [employeePhone, setEmployeePhone] = useState("");
  const [employeeCountryCode, setEmployeeCountryCode] = useState("IN");
  const [employeeEmail, setEmployeeEmail] = useState("");

  const handleModeSwitch = (next: LoginMode) => {
    setMode(next);
    setError("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Pre-flight phone length check (admin always, employee only when using
    // phone). Strict format rules (IN prefix 6-9, no all-same-digit) are
    // intentionally NOT enforced at login — they belong on account creation,
    // not on the sign-in path where legacy/test accounts may differ.
    const usingPhone =
      (mode === "admin" && adminIdentifierType === "phone") ||
      (mode === "employee" && employeeIdentifierType === "phone");
    if (usingPhone) {
      const activePhone = mode === "admin" ? phone : employeePhone;
      const activeCountry = mode === "admin" ? countryCode : employeeCountryCode;
      const expected = PHONE_RULES[activeCountry]?.length ?? 10;

      if (activePhone.length !== expected) {
        setError(`Phone number must be exactly ${expected} digits`);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "admin") {
        const credentials =
          adminIdentifierType === "email"
            ? { email: adminEmail, password }
            : { phone, countryCode, password };
        await login(credentials, "admin");
      } else {
        const credentials =
          employeeIdentifierType === "email"
            ? { email: employeeEmail, password }
            : { phone: employeePhone, countryCode: employeeCountryCode, password };
        await login(credentials, "employee");
      }
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground text-lg font-bold mb-4">
            M
          </div>
          <h1 className="text-xl font-bold text-foreground">MegaClick</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access the dashboard</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-border bg-muted/40 p-1 mb-4 gap-1">
          <button
            type="button"
            onClick={() => handleModeSwitch("admin")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-md text-sm font-medium transition-colors ${mode === "admin"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("employee")}
            className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-md text-sm font-medium transition-colors ${mode === "employee"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Employee
          </button>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* ── Admin Fields ── */}
            {mode === "admin" && (
              <>
                {/* Identifier sub-toggle */}
                <div className="flex rounded-md border border-border overflow-hidden text-sm">
                  <button
                    type="button"
                    onClick={() => setAdminIdentifierType("phone")}
                    className={`flex-1 h-8 font-medium transition-colors ${adminIdentifierType === "phone"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminIdentifierType("email")}
                    className={`flex-1 h-8 font-medium transition-colors ${adminIdentifierType === "email"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Email
                  </button>
                </div>

                {adminIdentifierType === "phone" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Country</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="IN">🇮🇳 India (+91)</option>
                        <option value="US">🇺🇸 United States (+1)</option>
                        <option value="GB">🇬🇧 United Kingdom (+44)</option>
                        <option value="AE">🇦🇪 UAE (+971)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={PHONE_RULES[countryCode]?.length ?? 15}
                        value={phone}
                        onChange={(e) => setPhone(sanitizeDigits(e.target.value, PHONE_RULES[countryCode]?.length ?? 15))}
                        placeholder={PHONE_RULES[countryCode]?.placeholder ?? "e.g. 9876543210"}
                        required
                        className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {PHONE_RULES[countryCode]?.hint ?? "Digits only"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                )}
              </>
            )}

            {/* ── Employee Fields ── */}
            {mode === "employee" && (
              <>
                {/* Identifier sub-toggle */}
                <div className="flex rounded-md border border-border overflow-hidden text-sm">
                  <button
                    type="button"
                    onClick={() => setEmployeeIdentifierType("phone")}
                    className={`flex-1 h-8 font-medium transition-colors ${employeeIdentifierType === "phone"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeIdentifierType("email")}
                    className={`flex-1 h-8 font-medium transition-colors ${employeeIdentifierType === "email"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Email
                  </button>
                </div>

                {employeeIdentifierType === "phone" ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Country</label>
                      <select
                        value={employeeCountryCode}
                        onChange={(e) => setEmployeeCountryCode(e.target.value)}
                        className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="IN">🇮🇳 India (+91)</option>
                        <option value="US">🇺🇸 United States (+1)</option>
                        <option value="GB">🇬🇧 United Kingdom (+44)</option>
                        <option value="AE">🇦🇪 UAE (+971)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-foreground">Phone Number</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={PHONE_RULES[employeeCountryCode]?.length ?? 15}
                        value={employeePhone}
                        onChange={(e) => setEmployeePhone(sanitizeDigits(e.target.value, PHONE_RULES[employeeCountryCode]?.length ?? 15))}
                        placeholder={PHONE_RULES[employeeCountryCode]?.placeholder ?? "e.g. 9876543210"}
                        required
                        className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {PHONE_RULES[employeeCountryCode]?.hint ?? "Digits only"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <input
                      type="email"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                )}
              </>
            )}

            {/* Password (shared) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full h-9 rounded-md border border-border bg-muted/50 px-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In as {mode === "admin" ? "Admin" : "Employee"}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Authorised personnel only. Unauthorised access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;