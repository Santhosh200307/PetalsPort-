import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmoothScroll from "@/lib/SmoothScroll";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import CategoryShowcase from "@/pages/CategoryShowcase";
import BulkQuote from "@/pages/BulkQuote";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Cart from "@/pages/Cart";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <CartProvider>
        <BrowserRouter>
          <SmoothScroll>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:slug" element={<CategoryShowcase />} />
              <Route path="/quote" element={<BulkQuote />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
          </SmoothScroll>
        </BrowserRouter>
        <Toaster position="top-right" />
      </CartProvider>
    </div>
  );
}

export default App;
