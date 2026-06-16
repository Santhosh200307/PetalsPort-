import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Reveal } from "@/components/ScrollReveal";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`;

const FLORAL_IMAGE = "https://images.unsplash.com/photo-1561848355-890d054dc55a?crop=entropy&cs=srgb&fm=jpg&q=85";

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
    <main data-testid="auth-page" className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F5] pt-20 lg:pt-0 overflow-hidden">
      
      {/* Visual Side Panel (Desktop only) */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[#1A2F24]">
          <img 
            src={FLORAL_IMAGE} 
            alt="Luxury Floral Background" 
            className="w-full h-full object-cover opacity-85 transition-transform duration-[2.5s] ease-out hover:scale-105"
          />
        </div>
        {/* Cinematic Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2F24] via-[#1A2F24]/40 to-transparent" />
        
        {/* Panel Brand/Content */}
        <div className="absolute bottom-16 left-16 right-16 text-[#FAF8F5] z-10">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.35em] text-[#E5E0D8] opacity-80 mb-4">PetalsPort Procurement</div>
            <h2 className="font-serif-display text-4xl md:text-5xl leading-tight text-[#FAF8F5]">
              Freshly Sourced. <br />
              <span className="italic font-light">Elegantly Delivered.</span>
            </h2>
            <p className="mt-6 text-sm text-[#E5E0D8] max-w-sm leading-relaxed font-light opacity-90">
              Join local florists, wedding venues, and corporate accounts accessing fresh premium stems.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Forms Side Panel */}
      <div className="w-full lg:w-1/2 min-h-[calc(100vh-80px)] lg:min-h-screen flex items-center justify-center py-16 px-6 relative bg-[#FAF8F5]">
        
        {/* Subtle Background Watermark Layer for Floral texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url(${FLORAL_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <Reveal>
            <div className="text-center mb-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Account Portal</span>
              <h1 className="font-serif-display text-4xl mt-3 text-[#1A2F24]">
                Step into the <span className="italic">bloom</span>.
              </h1>
              <p className="mt-3 text-sm text-[#5C7065]">
                Access wholesale pricing, saved quotes, and track orders.
              </p>
            </div>
          </Reveal>

          {/* Tab Headers */}
          <div className="flex border-b border-[#E5E0D8] mb-8 relative">
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

          {/* Form Container */}
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-[#E5E0D8] rounded-2xl p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5C7065] font-bold mb-2">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={16} className="absolute left-4 text-[#5C7065]" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full py-3 pl-12 pr-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C7065] font-bold mb-2">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-4 text-[#5C7065]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full py-3 pl-12 pr-4 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C7065] font-bold mb-2">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-4 text-[#5C7065]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full py-3 pl-12 pr-12 text-sm outline-none text-[#1A2F24] focus:border-[#1A2F24] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[#5C7065] hover:text-[#1A2F24] outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A2F24] text-[#FAF8F5] hover:bg-[#2C4A3A] disabled:bg-[#5C7065] rounded-full py-3.5 px-6 font-medium text-sm flex items-center justify-center gap-2 transition-colors duration-300 relative group overflow-hidden mt-8"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-[#FAF8F5] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
