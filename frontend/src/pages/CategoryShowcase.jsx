import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { Reveal, FadeIn } from "@/components/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CategoryShowcase() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const products = getProductsByCategory(slug);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  if (!category) {
    return (
      <main className="pt-32 pb-32 min-h-screen">
        <div className="text-center font-serif-display text-4xl">Category not found</div>
      </main>
    );
  }

  return (
    <main data-testid={`category-page-${slug}`} className="bg-[#FAF8F5]">
      {/* Hero */}
      <section ref={ref} className="relative min-h-[80vh] overflow-hidden flex items-end pb-20">
        <motion.div style={{ y: imgY }} className="absolute inset-0 -top-[10%] h-[120%]">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-[#FAF8F5]">
          <FadeIn>
            <div className="text-xs uppercase tracking-[0.32em] mb-6 text-[#FAF8F5]/80">
              Collection · {category.name}
            </div>
            <h1 className="font-serif-display leading-[0.92] text-[clamp(3rem,9vw,8.5rem)]">
              {category.tagline.split(",")[0]},<br />
              <span className="italic text-[#E5E0D8]">{category.tagline.split(",")[1]?.trim()}</span>
            </h1>
            <p className="mt-8 max-w-xl text-[#FAF8F5]/85 leading-relaxed">{category.description}</p>
          </FadeIn>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4 text-xs uppercase tracking-[0.25em] text-[#5C7065]">
            · How we build a {category.name.toLowerCase()} story
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-7 md:col-start-6 font-serif-display text-3xl md:text-5xl leading-tight">
            {category.slug === "wedding" && "Mandap to mehndi — every garland counted, every petal accounted for."}
            {category.slug === "birthday" && "Soft palettes, playful clusters, photo-ready setups that keep the room smiling."}
            {category.slug === "corporate" && "Restrained luxury for boardrooms, AGMs and signing ceremonies — invoiced and on time."}
          </Reveal>
        </div>
      </section>

      {/* Products grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="flex items-end justify-between mb-10">
            <h2 className="font-serif-display text-3xl md:text-5xl">Featured for {category.name.toLowerCase()}</h2>
            <Link to="/catalog" className="text-xs uppercase tracking-[0.2em] hover:text-[#8C2131] transition-colors">All blooms →</Link>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link to={`/product/${p.id}`} data-testid={`category-product-${p.id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-[#E5E0D8]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <div className="font-serif-display text-xl">{p.name}</div>
                    <div className="text-sm">₹{p.retailPrice}</div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="bg-[#1A2F24] text-[#FAF8F5] p-12 md:p-20 rounded-md flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#E5E0D8]/80 mb-4">Custom build</div>
              <h3 className="font-serif-display text-4xl md:text-5xl leading-tight max-w-2xl">Need a {category.name.toLowerCase()} setup tailored to your venue?</h3>
            </div>
            <Link to="/quote" data-testid="category-quote-cta" className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3 text-sm hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors">
              Get a designer brief <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
