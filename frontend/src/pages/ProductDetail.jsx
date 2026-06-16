import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductById, PRODUCTS } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { Reveal } from "@/components/ScrollReveal";
import { Minus, Plus, ArrowUpRight, Truck, Leaf, Snowflake } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState("retail");

  if (!product) {
    return (
      <main className="pt-32 pb-32 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="font-serif-display text-5xl">Bloom not found</div>
          <Link to="/catalog" className="mt-6 inline-block text-[#8C2131] underline">Back to catalog</Link>
        </div>
      </main>
    );
  }

  const isWholesale = mode === "wholesale";
  const unitPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const meetsMin = !isWholesale || qty >= product.minWholesale;
  const total = unitPrice * qty;
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    if (!meetsMin) {
      toast.error(`Wholesale minimum is ${product.minWholesale} ${product.unit.startsWith("kil") ? "kg" : "units"}`);
      return;
    }
    addItem(product, qty, mode);
    toast.success(`Added ${qty} × ${product.name}`);
  };

  return (
    <main data-testid="product-detail-page" className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">
          <Link to="/catalog" className="hover:text-[#8C2131]">Catalog</Link> · {product.name}
        </Reveal>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden bg-[#E5E0D8]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:pt-8">
            <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">{product.color} · {product.season}</div>
            <h1 className="font-serif-display text-5xl md:text-7xl leading-none mt-3">{product.name}</h1>
            <p className="mt-6 text-[#1A2F24]/85 leading-relaxed text-lg">{product.description}</p>

            {/* Mode toggle */}
            <div data-testid="pricing-mode-toggle" className="mt-10 inline-flex bg-white border border-[#E5E0D8] rounded-full p-1">
              <button
                data-testid="mode-retail"
                onClick={() => setMode("retail")}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${mode === "retail" ? "bg-[#1A2F24] text-[#FAF8F5]" : "text-[#1A2F24]"}`}
              >
                Retail
              </button>
              <button
                data-testid="mode-wholesale"
                onClick={() => { setMode("wholesale"); setQty(product.minWholesale); }}
                className={`px-5 py-2 rounded-full text-sm transition-colors ${mode === "wholesale" ? "bg-[#1A2F24] text-[#FAF8F5]" : "text-[#1A2F24]"}`}
              >
                Wholesale
              </button>
            </div>

            <div className="mt-8 flex items-end gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">{isWholesale ? "Trade price" : "Retail price"}</div>
                <div data-testid="product-price" className="font-serif-display text-6xl mt-1 leading-none">₹{unitPrice}</div>
                <div className="text-sm text-[#5C7065] mt-2">per {product.unit}</div>
              </div>
              {isWholesale && (
                <div className="border-l border-[#E5E0D8] pl-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Min order</div>
                  <div className="font-serif-display text-2xl mt-1">{product.minWholesale}</div>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-6">
              <div className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Quantity</div>
              <div className="inline-flex items-center border border-[#1A2F24] rounded-full">
                <button data-testid="qty-decrement" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 inline-flex items-center justify-center">
                  <Minus size={16} />
                </button>
                <input data-testid="qty-input" type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1")))} className="w-16 text-center bg-transparent outline-none" />
                <button data-testid="qty-increment" onClick={() => setQty((q) => q + 1)} className="w-11 h-11 inline-flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-sm text-[#5C7065]">Subtotal: <span className="font-serif-display text-lg text-[#1A2F24]">₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            {!meetsMin && (
              <div data-testid="min-order-warning" className="mt-3 text-sm text-[#8C2131]">Wholesale requires minimum {product.minWholesale} units.</div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button data-testid="add-to-cart-button" onClick={handleAdd} className="inline-flex items-center gap-2 rounded-full bg-[#1A2F24] text-[#FAF8F5] px-8 py-4 text-sm tracking-wide hover:bg-[#2C4A3A] transition-colors">
                Add to Cart <ArrowUpRight size={16} />
              </button>
              <Link to="/quote" data-testid="request-quote-link" className="inline-flex items-center gap-2 rounded-full border border-[#1A2F24] text-[#1A2F24] px-8 py-4 text-sm tracking-wide hover:bg-[#1A2F24] hover:text-[#FAF8F5] transition-colors">
                Request Custom Quote
              </Link>
            </div>

            {/* Inline details */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#E5E0D8] pt-6">
              {[
                { icon: Snowflake, label: "Cold-chain delivered" },
                { icon: Truck, label: "Dawn dispatch" },
                { icon: Leaf, label: "Vase life 7–10d" },
              ].map((d, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <d.icon size={20} className="text-[#8C2131]" strokeWidth={1.5} />
                  <div className="text-sm text-[#5C7065]">{d.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <Reveal className="text-xs uppercase tracking-[0.25em] text-[#5C7065] mb-6">In the same arrangement</Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link to={`/product/${p.id}`} className="group block">
                    <div className="aspect-[4/5] overflow-hidden bg-[#E5E0D8]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="font-serif-display text-xl">{p.name}</div>
                      <div className="text-sm text-[#5C7065]">₹{p.retailPrice}</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
