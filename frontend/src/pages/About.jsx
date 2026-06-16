import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, SplitWords } from "@/components/ScrollReveal";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <main data-testid="about-page" className="bg-[#FAF8F5]">
      {/* Hero */}
      <section ref={ref} className="relative min-h-[85vh] overflow-hidden flex items-end pb-20">
        <motion.div style={{ y }} className="absolute inset-0 -top-[10%] h-[120%]">
          <img
            src="https://images.unsplash.com/photo-1600104197373-c07cc35e4f61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHx3aG9sZXNhbGUlMjBmcmVzaCUyMGZsb3dlcnMlMjBtYXJrZXR8ZW58MHx8fHwxNzgxNTg3NTEzfDA&ixlib=rb-4.1.0&q=85"
            alt="Wholesale market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-[#FAF8F5]">
          <div className="text-xs uppercase tracking-[0.32em] mb-6">Our Story</div>
          <h1 className="font-serif-display text-[clamp(3rem,9vw,9rem)] leading-[0.92]">
            <SplitWords text="A family" />
            <br />
            <span className="italic text-[#E5E0D8]"><SplitWords text="of florists." delay={0.1} /></span>
          </h1>
        </div>
      </section>

      {/* Editorial body */}
      <section className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4 text-xs uppercase tracking-[0.25em] text-[#5C7065]">
            · 1998 — Bengaluru, KR Market
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-7 md:col-start-6 font-serif-display text-3xl md:text-5xl leading-tight">
            What began as a single trader stall now supplies blooms to 800+ designers, 200+ studios and 60 cities — overnight.
          </Reveal>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 grid grid-cols-1 md:grid-cols-12 gap-10">
          <Reveal delay={0.15} className="md:col-span-5 md:col-start-6 text-[#1A2F24]/85 leading-relaxed text-lg space-y-5">
            <p>
              PetalsPort is a third-generation floral business. We still buy at 3am from the KR Market auction, but
              the cuts now leave our cold-storage door for Mumbai, Delhi, Pune, Hyderabad and beyond before sunrise.
            </p>
            <p>
              Our team of florist designers works alongside wedding planners, hotel groups, and corporate offices —
              translating moods into stem lists, structures, and flawless on-site delivery.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { n: "26y", l: "in the floral trade" },
            { n: "12K+", l: "events fulfilled" },
            { n: "60+", l: "cities reached" },
            { n: "3am", l: "daily market run" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-t border-[#1A2F24]/30 pt-5">
                <div className="font-serif-display text-5xl md:text-7xl leading-none">{s.n}</div>
                <div className="mt-3 text-sm text-[#5C7065]">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Reveal className="text-xs uppercase tracking-[0.25em] text-[#5C7065] mb-8">
            · How we work
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {[
              { t: "Brief", d: "You share the event, palette, and structures." },
              { t: "Source", d: "Daily auction & farm-direct procurement at dawn." },
              { t: "Condition", d: "Cold storage, sorting, grading, hydration." },
              { t: "Deliver", d: "Refrigerated dispatch, on-site florist if needed." },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="font-serif-display text-sm uppercase tracking-[0.25em] text-[#8C2131] mb-3">0{i + 1}</div>
                <div className="font-serif-display text-3xl">{p.t}</div>
                <p className="mt-3 text-[#5C7065] leading-relaxed">{p.d}</p>
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
              <h3 className="font-serif-display text-4xl md:text-6xl leading-none">Work with our florists.</h3>
              <p className="mt-4 text-[#FAF8F5]/80 max-w-xl">Whether a fortnightly office bouquet or a 1500-guest wedding, we'd love to compose for you.</p>
            </div>
            <Link to="/quote" className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] text-[#1A2F24] px-7 py-3 text-sm hover:bg-[#8C2131] hover:text-[#FAF8F5] transition-colors">
              Start a brief <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
