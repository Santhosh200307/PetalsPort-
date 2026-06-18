import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/category/wedding", label: "Wedding" },
  { to: "/category/birthday", label: "Birthday" },
  { to: "/category/corporate", label: "Corporate" },
  { to: "/quote", label: "Bulk Quote" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Signed out successfully.");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isDarkBgPage = location.pathname === "/login";

  const activeLinks = [...links];
  if (user && user.role === 'admin') {
    if (!activeLinks.some(l => l.to === '/admin')) {
      activeLinks.push({ to: '/admin', label: 'Admin Dashboard' });
    }
  }

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#E5E0D8]/70"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 28 28" className={`transition-transform duration-700 group-hover:rotate-45 ${!scrolled && isDarkBgPage ? "text-[#FAF8F5]" : "text-[#1A2F24]"}`}>
            <circle cx="14" cy="6" r="4" fill="currentColor" opacity="0.85"/>
            <circle cx="22" cy="14" r="4" fill="currentColor" opacity="0.7"/>
            <circle cx="14" cy="22" r="4" fill="currentColor" opacity="0.85"/>
            <circle cx="6" cy="14" r="4" fill="currentColor" opacity="0.7"/>
            <circle cx="14" cy="14" r="3" fill="#8C2131"/>
          </svg>
          <span className={`font-serif-display text-2xl tracking-tight leading-none ${!scrolled && isDarkBgPage ? "text-[#FAF8F5]" : "text-[#1A2F24]"}`}>
            Petals<span className="italic text-[#8C2131]">Port</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {activeLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(" ", "-")}`}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors duration-300 hover:text-[#8C2131] ${
                  isActive 
                    ? "text-[#8C2131]" 
                    : (!scrolled && isDarkBgPage ? "text-[#FAF8F5]" : "text-[#1A2F24]")
                }`
              }
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-xs text-[#5C7065] font-medium flex items-center gap-1.5 bg-[#E5E0D8]/45 px-3 py-1.5 rounded-full">
                <User size={12} className="text-[#8C2131]" />
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                data-testid="logout-button"
                className={`inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 ${!scrolled && isDarkBgPage ? "border-[#FAF8F5] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#1A2F24]" : "border-[#8C2131]/40 text-[#8C2131] hover:bg-[#8C2131] hover:text-[#FAF8F5]"}`}
                aria-label="Sign Out"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              data-testid="login-link"
              className={`hidden lg:inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 ${!scrolled && isDarkBgPage ? "border-[#FAF8F5] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#1A2F24]" : "border-[#1A2F24] text-[#1A2F24] hover:bg-[#1A2F24] hover:text-[#FAF8F5]"}`}
              aria-label="Sign In"
              title="Sign In"
            >
              <LogIn size={16} />
            </Link>
          )}

          <Link
            to="/cart"
            data-testid="nav-cart-link"
            className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 ${!scrolled && isDarkBgPage ? "border-[#FAF8F5] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#1A2F24]" : "border-[#1A2F24] text-[#1A2F24] hover:bg-[#1A2F24] hover:text-[#FAF8F5]"}`}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#8C2131] text-[10px] text-white flex items-center justify-center font-medium"
              >
                {count}
              </span>
            )}
          </Link>
          <button
            data-testid="mobile-menu-toggle"
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-300 ${!scrolled && isDarkBgPage ? "border-[#FAF8F5] text-[#FAF8F5] hover:bg-[#FAF8F5] hover:text-[#1A2F24]" : "border-[#1A2F24] text-[#1A2F24] hover:bg-[#1A2F24] hover:text-[#FAF8F5]"}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden bg-[#FAF8F5] border-t border-[#E5E0D8] overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-4">
              {activeLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-${l.label.toLowerCase().replace(" ", "-")}`}
                  className="font-serif-display text-2xl text-[#1A2F24]"
                  end={l.to === "/"}
                >
                  {l.label}
                </NavLink>
              ))}
              <hr className="border-[#E5E0D8] my-2" />
              {user ? (
                <div className="flex flex-col gap-3">
                  <span className="text-sm text-[#5C7065]">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left font-serif-display text-2xl text-[#8C2131]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="font-serif-display text-2xl text-[#1A2F24]"
                >
                  Sign In
                </NavLink>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
