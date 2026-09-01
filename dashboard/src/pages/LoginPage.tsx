import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, LogIn, ShieldCheck, Briefcase } from "lucide-react";

type LoginMode = "admin" | "employee";

// Phone logins are Indian mobile numbers — the only country this tool serves,
// so there's nothing for the user to pick.
const PHONE_COUNTRY = "IN";
const PHONE_LENGTH = 10;

const looksLikeEmail = (value: string) => value.includes("@");

const sanitizeDigits = (raw: string) => raw.replace(/\D/g, "");

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<LoginMode>("admin");

  // Shared
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // One field per mode, holding either a phone number or an email address —
  // which it is gets sniffed out at submit time by whether it contains "@".
  const [adminIdentifier, setAdminIdentifier] = useState("");
  const [employeeIdentifier, setEmployeeIdentifier] = useState("");

  const handleModeSwitch = (next: LoginMode) => {
    setMode(next);
    setError("");
    setPassword("");
  };

  const handleIdentifierChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only constrain digit-only input to a sane phone length; anything with an
    // "@" (or other letters, mid-typing) passes through untouched so email
    // entry never fights the input.
    setter(looksLikeEmail(raw) || /[a-zA-Z]/.test(raw) ? raw : sanitizeDigits(raw).slice(0, PHONE_LENGTH));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const identifier = (mode === "admin" ? adminIdentifier : employeeIdentifier).trim();
    if (!identifier) {
      setError("Enter your phone number or email address");
      return;
    }

    const isEmail = looksLikeEmail(identifier);
    const digits = sanitizeDigits(identifier);

    if (!isEmail && digits.length !== PHONE_LENGTH) {
      setError(`Phone number must be exactly ${PHONE_LENGTH} digits`);
      return;
    }

    setLoading(true);

    try {
      const credentials = isEmail
        ? { email: identifier, password }
        : { phone: digits, countryCode: PHONE_COUNTRY, password };
      await login(credentials, mode);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const identifier = mode === "admin" ? adminIdentifier : employeeIdentifier;
  const setIdentifier = mode === "admin" ? setAdminIdentifier : setEmployeeIdentifier;

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

            {/* Phone or email — one field, auto-detected */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Phone or Email</label>
              <input
                type="text"
                inputMode="text"
                autoComplete="username"
                value={identifier}
                onChange={handleIdentifierChange(setIdentifier)}
                placeholder="9876543210 or you@company.com"
                required
                className="h-9 rounded-md border border-border bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <p className="text-[11px] text-muted-foreground">
                10-digit mobile number or your email address
              </p>
            </div>

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
