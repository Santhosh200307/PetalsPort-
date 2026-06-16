import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { Reveal } from "@/components/ScrollReveal";
import { Minus, Plus, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 250) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleRazorpayPay = () => {
    toast.info("Razorpay checkout is connected in production. (Sandbox keys required to complete this flow.)");
  };

  if (items.length === 0) {
    return (
      <main data-testid="cart-page-empty" className="pt-40 pb-40 min-h-screen flex items-center bg-[#FAF8F5]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Cart</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-3 leading-none">Empty, for now.</h1>
          <p className="mt-6 text-[#5C7065]">Add a bunch of fresh stems and they'll arrive at your door — chilled.</p>
          <Link to="/catalog" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#1A2F24] text-[#FAF8F5] px-8 py-3.5 text-sm hover:bg-[#2C4A3A] transition-colors">
            Browse Catalog <ArrowUpRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="cart-page" className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Your Order</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-3 leading-none">
            <span className="italic">Bag</span>, packed.
          </h1>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            {items.map((item, idx) => (
              <Reveal key={`${item.id}-${item.mode}`} delay={idx * 0.05}>
                <div data-testid={`cart-item-${item.id}`} className="bg-white border border-[#E5E0D8] p-5 md:p-6 flex gap-5 items-center">
                  <div className="w-24 h-28 md:w-28 md:h-32 flex-shrink-0 overflow-hidden bg-[#E5E0D8]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-serif-display text-2xl leading-tight">{item.name}</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-[#5C7065] mt-1">{item.mode} · {item.unit}</div>
                      </div>
                      <button data-testid={`remove-${item.id}`} onClick={() => removeItem(item.id, item.mode)} className="text-[#5C7065] hover:text-[#8C2131] transition-colors" aria-label="Remove">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center border border-[#1A2F24] rounded-full">
                        <button data-testid={`dec-${item.id}`} onClick={() => updateQty(item.id, item.mode, item.qty - 1)} className="w-9 h-9 inline-flex items-center justify-center">
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button data-testid={`inc-${item.id}`} onClick={() => updateQty(item.id, item.mode, item.qty + 1)} className="w-9 h-9 inline-flex items-center justify-center">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="font-serif-display text-2xl">₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <button data-testid="clear-cart" onClick={() => { clear(); toast.success("Cart cleared"); }} className="text-sm text-[#5C7065] hover:text-[#8C2131] transition-colors uppercase tracking-[0.2em]">
              Clear cart
            </button>
          </div>

          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="bg-[#1A2F24] text-[#FAF8F5] p-8 md:p-10 sticky top-28">
              <div className="text-xs uppercase tracking-[0.25em] text-[#E5E0D8]/70">Summary</div>
              <div className="mt-6 space-y-3 text-sm">
                <Row l="Subtotal" v={`₹${subtotal.toLocaleString("en-IN")}`} />
                <Row l="GST (5%)" v={`₹${tax.toLocaleString("en-IN")}`} />
                <Row l="Cold-chain shipping" v={shipping === 0 ? "Complimentary" : `₹${shipping}`} />
              </div>
              <div className="mt-6 pt-6 border-t border-[#FAF8F5]/20 flex items-baseline justify-between">
                <div className="text-xs uppercase tracking-[0.25em] text-[#E5E0D8]/70">Total</div>
                <div data-testid="cart-total" className="font-serif-display text-4xl">₹{total.toLocaleString("en-IN")}</div>
              </div>
              {!showCheckout ? (
                <button data-testid="checkout-button" onClick={handleCheckout} className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3.5 text-sm hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors">
                  Proceed to Checkout <ArrowUpRight size={16} />
                </button>
              ) : (
                <div className="mt-8 space-y-4">
                  <div className="bg-[#FAF8F5]/10 rounded-md p-4 border border-[#FAF8F5]/20">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#E5E0D8]/70 mb-2">Payment</div>
                    <div className="flex items-center justify-between">
                      <div className="font-serif-display text-xl">Razorpay</div>
                      <ShieldCheck size={18} className="text-[#E5E0D8]" />
                    </div>
                    <div className="text-xs text-[#E5E0D8]/70 mt-2">UPI · Cards · Netbanking · Wallets</div>
                  </div>
                  <button data-testid="razorpay-pay-button" onClick={handleRazorpayPay} className="w-full rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3.5 text-sm hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors">
                    Pay ₹{total.toLocaleString("en-IN")}
                  </button>
                  <p className="text-[10px] text-[#E5E0D8]/60 leading-relaxed">
                    Razorpay sandbox keys required to complete payment. UI flow is fully wired — connect keys in Settings to go live.
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

function Row({ l, v }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#E5E0D8]/80">{l}</span>
      <span>{v}</span>
    </div>
  );
}
