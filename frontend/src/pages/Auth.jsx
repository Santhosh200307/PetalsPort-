import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Reveal } from "@/components/ScrollReveal";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

// Disciplined, high-end, vibrant decorative flower image
const FLORAL_IMAGE = "https://images.unsplash.com/photo-1507290439931-a861b5a38200?crop=entropy&cs=srgb&fm=jpg&q=85";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (isSignUp && !formData.name) {
      toast.error("Please provide your name.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const response = await axios.post(`${API}/auth/register`, {
          email: formData.email,
          password: formData.password,
          role: "user",
        });
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Account created successfully! Welcome to PetalsPort.");
        
        window.dispatchEvent(new Event("auth-change"));
        navigate("/catalog");
      } else {
        const response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Successfully logged in! Welcome back.");
        
        window.dispatchEvent(new Event("auth-change"));
        navigate("/catalog");
      }
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Authentication failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-testid="auth-page" className="min-h-screen w-full relative flex items-center justify-center py-24 px-6 bg-[#1A2F24] overflow-hidden">
      
      {/* Full-screen Floral Background Layer (faint & disciplined) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={FLORAL_IMAGE} 
          alt="Full screen Floral Background" 
          className="w-full h-full object-cover opacity-[0.20]"
        />
        {/* Soft dark vignette filter for contrast */}
        <div className="absolute inset-0 bg-[#1A2F24]/40 backdrop-blur-[1px]" />
      </div>

      {/* Centered Login Card Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Form Container (Frosted glassmorphism to show the background flower textures behind the fields) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FAF8F5]/90 backdrop-blur-xl border border-[#E5E0D8]/40 rounded-2xl p-8 md:p-10 shadow-2xl"
        >
          <Reveal>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Account Portal</span>
              <h1 className="font-serif-display text-4xl mt-3 text-[#1A2F24]">
                Step into the <span className="italic text-[#8C2131]">bloom</span>.
              </h1>
              <p className="mt-3 text-sm text-[#5C7065] leading-relaxed">
                Access wholesale pricing, saved quotes, and track orders.
              </p>
            </div>
          </Reveal>

          {/* Tab Headers */}
          <div className="flex border-b border-[#E5E0D8]/70 mb-8 relative">
            <button
              onClick={() => {
                setIsSignUp(false);
                setFormData({ name: "", email: "", password: "" });
              }}
              className={`flex-1 pb-4 text-sm font-medium tracking-wide transition-colors duration-300 relative ${
                !isSignUp ? "text-[#1A2F24]" : "text-[#5C7065] hover:text-[#1A2F24]"
              }`}
            >
              Sign In
              {!isSignUp && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C2131]"
                />
              )}
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setFormData({ name: "", email: "", password: "" });
              }}
              className={`flex-1 pb-4 text-sm font-medium tracking-wide transition-colors duration-300 relative ${
                isSignUp ? "text-[#1A2F24]" : "text-[#5C7065] hover:text-[#1A2F24]"
              }`}
            >
              Create Account
              {isSignUp && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8C2131]"
                />
              )}
            </button>
          </div>

          {/* Form */}
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={14} className="absolute left-4 text-[#5C7065]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-[#FAF8F5]/80 border border-[#E5E0D8] rounded-full py-3 pl-12 pr-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={14} className="absolute left-4 text-[#5C7065]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#FAF8F5]/80 border border-[#E5E0D8] rounded-full py-3 pl-12 pr-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#5C7065] font-bold mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={14} className="absolute left-4 text-[#5C7065]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FAF8F5]/80 border border-[#E5E0D8] rounded-full py-3 pl-12 pr-12 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#5C7065] hover:text-[#1A2F24] outline-none"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A2F24] text-[#FAF8F5] hover:bg-[#2C4A3A] disabled:bg-[#5C7065] rounded-full py-3.5 px-6 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-300 relative group overflow-hidden mt-6"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-[#FAF8F5] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
