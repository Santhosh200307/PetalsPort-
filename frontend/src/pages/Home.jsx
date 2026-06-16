import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, ArrowUpRight, Sparkles, Truck, ShieldCheck, Quote } from "lucide-react";
import { Reveal, FadeIn, SplitWords } from "@/components/ScrollReveal";
import { CATEGORIES, PRODUCTS, TESTIMONIALS } from "@/lib/data";

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOverlay = useTransform(heroProgress, [0, 1], [0.35, 0.7]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0%", "-25%"]);

  return (
    <main data-testid="home-page" className="bg-[#FAF8F5] text-[#1A2F24]">
      {/* HERO */}
      <section
        ref={heroRef}
        data-testid="home-hero"
        className="relative min-h-[100vh] w-full overflow-hidden flex items-end pb-20 md:pb-28"
      >
        <motion.div
          style={{ y: heroImageY }}
          className="absolute inset-0 -top-[10%] h-[120%]"
        >
          <img
            src="https://images.unsplash.com/photo-1561848355-890d054dc55a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGZsb3JhbCUyMGFycmFuZ2VtZW50fGVufDB8fHx8MTc4MTU4NzUxM3ww&ixlib=rb-4.1.0&q=85"
            alt="Floral arrangement"
            className="w-full h-full object-cover"
          />
          <motion.div style={{ opacity: heroOverlay }} className="absolute inset-0 bg-black" />
        </motion.div>

        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-[#FAF8F5]"
        >
          <FadeIn delay={0.1}>
            <div className="text-xs uppercase tracking-[0.32em] mb-6 text-[#FAF8F5]/80">
              Est. 1998 · Bengaluru, India
            </div>
          </FadeIn>
          <h1 className="font-serif-display font-medium leading-[0.92] tracking-tight text-[clamp(3rem,9vw,9rem)]">
            <span className="block">
              <SplitWords text="Florals," />
            </span>
            <span className="block italic text-[#E5E0D8]">
              <SplitWords text="composed." delay={0.15} />
            </span>
          </h1>
          <Reveal delay={0.6} className="mt-10 max-w-xl text-base md:text-lg text-[#FAF8F5]/85 leading-relaxed">
            Wholesale to retail — PetalsPort sources, conditions and delivers
            ceremony-grade blooms to designers, planners and dreamers across India.
          </Reveal>
          <Reveal delay={0.8} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/catalog"
              data-testid="hero-shop-catalog-btn"
              className="group inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3 text-sm tracking-wide hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors duration-300"
            >
              Shop the Catalog
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/quote"
              data-testid="hero-bulk-quote-btn"
              className="inline-flex items-center gap-2 rounded-full border border-[#FAF8F5]/70 text-[#FAF8F5] px-7 py-3 text-sm tracking-wide hover:bg-[#FAF8F5] hover:text-[#1A2F24] transition-colors duration-300"
            >
              Request a Bulk Quote
            </Link>
          </Reveal>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div data-testid="home-marquee" className="marquee-pp">
        <Marquee speed={45} gradient={false} pauseOnHover>
          {["Freshly Sourced", "Wholesale Pricing", "Pan-India Cold Chain", "Event-Grade Florals", "Daily Cuts", "Designer Bundles"].map((t, i) => (
            <span key={i} className="font-serif-display italic text-2xl md:text-3xl text-[#1A2F24] mx-12 flex items-center gap-12">
              {t}
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C2131] inline-block" />
            </span>
          ))}
        </Marquee>
      </div>

      {/* OVERLINE INTRO */}
      <section className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <Reveal className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">
              · 01 — The Studio
            </div>
            <div className="mt-4 font-serif-display text-3xl text-[#1A2F24]">
              A floral atelier built for India's most ambitious events.
            </div>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-7 md:col-start-6 text-lg leading-relaxed text-[#1A2F24]/85">
            From mandap to corner-office gifting, PetalsPort runs a daily cold chain
            between Bengaluru's wholesale market and your venue. Order a single bouquet
            or three thousand stems — the freshness signature is the same.
            <div className="mt-8 grid grid-cols-2 gap-6 max-w-md">
              <div className="border-t border-[#1A2F24]/30 pt-3">
                <div className="font-serif-display text-4xl">26y</div>
                <div className="text-sm text-[#5C7065]">in the trade</div>
              </div>
              <div className="border-t border-[#1A2F24]/30 pt-3">
                <div className="font-serif-display text-4xl">12K+</div>
                <div className="text-sm text-[#5C7065]">events served</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <section data-testid="home-categories" className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">· 02 — Curated for Occasion</div>
              <h2 className="font-serif-display text-4xl md:text-6xl mt-4 leading-none">Pick a moment.</h2>
            </div>
            <Link to="/catalog" data-testid="categories-view-all" className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] hover:text-[#8C2131] transition-colors">
              View full catalog <ArrowRight size={14} />
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {CATEGORIES.map((c, idx) => (
              <Reveal
                key={c.slug}
                delay={idx * 0.1}
                className={`group relative overflow-hidden rounded-md ${
                  idx === 0 ? "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[640px]" : "md:col-span-5 aspect-[4/3]"
                }`}
              >
                <Link to={`/category/${c.slug}`} data-testid={`category-card-${c.slug}`} className="block w-full h-full relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-[#FAF8F5]">
                    <div className="text-xs uppercase tracking-[0.25em] text-[#FAF8F5]/80 mb-3">
                      {c.tagline}
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div className="font-serif-display text-4xl md:text-6xl leading-none">
                        {c.name}
                      </div>
                      <div className="w-12 h-12 rounded-full border border-[#FAF8F5]/70 flex items-center justify-center transition-all duration-500 group-hover:bg-[#FAF8F5] group-hover:text-[#1A2F24]">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section data-testid="home-featured" className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">· 03 — In Bloom This Week</div>
            <h2 className="font-serif-display text-4xl md:text-6xl mt-4 leading-none">Fresh cuts.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link to={`/product/${p.id}`} data-testid={`featured-product-${p.id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-[#E5E0D8]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-serif-display text-xl">{p.name}</div>
                      <div className="text-sm text-[#5C7065] mt-1">{p.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif-display text-xl">₹{p.retailPrice}</div>
                      <div className="text-xs text-[#8C2131] mt-1">₹{p.wholesalePrice} bulk</div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHOLESALE / PARALLAX BANNER */}
      <ParallaxBanner />

      {/* VALUE PROPS */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Sparkles, title: "Daily Cuts", text: "Conditioned in cold storage within 4 hours of harvest." },
            { icon: Truck, title: "Pan-India Cold Chain", text: "Refrigerated logistics to 60+ cities, dawn deliveries." },
            { icon: ShieldCheck, title: "Event-Grade Promise", text: "Replacement-guaranteed graded stems for ceremonies." },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-t border-[#1A2F24]/30 pt-6">
                <v.icon size={28} className="text-[#8C2131] mb-6" strokeWidth={1.5} />
                <div className="font-serif-display text-2xl">{v.title}</div>
                <p className="mt-3 text-[#5C7065] leading-relaxed">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="mb-12">
            <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">· 04 — From the Field</div>
            <h2 className="font-serif-display text-4xl md:text-6xl mt-4 leading-none">Heard from the floor.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white border border-[#E5E0D8] p-8 h-full transition-transform duration-500 hover:-translate-y-1">
                  <Quote size={24} className="text-[#8C2131] mb-5" />
                  <p className="font-serif-display italic text-2xl leading-snug text-[#1A2F24]">
                    "{t.quote}"
                  </p>
                  <div className="mt-8 pt-4 border-t border-[#E5E0D8]">
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[#5C7065] mt-1">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="bg-[#1A2F24] text-[#FAF8F5] rounded-md p-12 md:p-20 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <h2 className="font-serif-display text-4xl md:text-6xl leading-none md:col-span-7">
              Planning something <span className="italic text-[#E5E0D8]">large?</span>
            </h2>
            <div className="md:col-span-5 flex flex-col gap-4 md:items-end">
              <p className="text-[#FAF8F5]/80 max-w-md">
                Share your event brief. Our florist designer responds within 4 working hours with a quote and look-book.
              </p>
              <Link to="/quote" data-testid="cta-bulk-quote" className="self-start md:self-end inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3 text-sm tracking-wide hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors duration-300">
                Start a Bulk Quote <ArrowUpRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function ParallaxBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  return (
    <section ref={ref} data-testid="home-parallax-banner" className="relative h-[80vh] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-[10%] h-[130%]">
        <img
          src="https://images.unsplash.com/photo-1600104197373-c07cc35e4f61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHx3aG9sZXNhbGUlMjBmcmVzaCUyMGZsb3dlcnMlMjBtYXJrZXR8ZW58MHx8fHwxNzgxNTg3NTEzfDA&ixlib=rb-4.1.0&q=85"
          alt="Wholesale market"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full text-[#FAF8F5]">
          <FadeIn>
            <div className="text-xs uppercase tracking-[0.32em] mb-6 text-[#FAF8F5]/80">
              · The Wholesale Door
            </div>
            <h2 className="font-serif-display text-5xl md:text-8xl leading-[0.95] max-w-3xl">
              Trader pricing,<br />
              <span className="italic text-[#E5E0D8]">studio finish.</span>
            </h2>
            <p className="mt-8 max-w-xl text-[#FAF8F5]/85">
              Sign in for trade access — minimum 30-stem orders, GST invoicing, dedicated florist designer,
              and rolling credit for verified event studios.
            </p>
            <Link to="/quote" data-testid="parallax-banner-cta" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3 text-sm tracking-wide hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors duration-300">
              Apply for Trade Account <ArrowUpRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
