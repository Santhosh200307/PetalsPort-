import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "@/lib/data";
import { Reveal } from "@/components/ScrollReveal";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Catalog() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const products = useMemo(() => {
    let list = PRODUCTS;
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.retailPrice - a.retailPrice);
    return list;
  }, [category, query, sort]);

  return (
    <main data-testid="catalog-page" className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">The Catalog</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-3 leading-none">
            Stems, by the <span className="italic">stem</span>.
          </h1>
          <p className="mt-6 max-w-xl text-[#5C7065] leading-relaxed">
            Browse our living inventory. Retail and wholesale pricing shown side by side — wholesale unlocks at the listed minimum order.
          </p>
        </Reveal>

        {/* Filters */}
        <div data-testid="catalog-filters" className="mt-14 flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-[#E5E0D8] py-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[{ slug: "all", name: "All" }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug}
                data-testid={`filter-cat-${c.slug}`}
                onClick={() => setCategory(c.slug)}
                className={`whitespace-nowrap text-sm px-4 py-2 rounded-full border transition-all duration-300 ${
                  category === c.slug
                    ? "bg-[#1A2F24] text-[#FAF8F5] border-[#1A2F24]"
                    : "border-[#E5E0D8] text-[#1A2F24] hover:border-[#1A2F24]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#E5E0D8] rounded-full px-4 py-2 bg-white">
              <Search size={16} className="text-[#5C7065]" />
              <input
                data-testid="catalog-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blooms…"
                className="bg-transparent outline-none text-sm w-40"
              />
            </div>
            <div className="flex items-center gap-2 border border-[#E5E0D8] rounded-full px-3 py-2 bg-white">
              <SlidersHorizontal size={16} className="text-[#5C7065]" />
              <select data-testid="catalog-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none text-sm">
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low → high</option>
                <option value="price-desc">Price: high → low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div data-testid="catalog-grid" className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 6) * 0.05}>
              <Link to={`/product/${p.id}`} data-testid={`catalog-product-${p.id}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-[#E5E0D8]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
                </div>
                <div className="mt-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">{p.season} · {p.color}</div>
                  <div className="mt-1 flex items-baseline justify-between gap-4">
                    <div className="font-serif-display text-2xl">{p.name}</div>
                    <div className="font-serif-display text-2xl">₹{p.retailPrice}</div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-[#5C7065]">{p.unit}</span>
                    <span className="text-[#8C2131]">₹{p.wholesalePrice} · bulk</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {products.length === 0 && (
          <div data-testid="catalog-empty" className="py-24 text-center text-[#5C7065]">No blooms match that. Try clearing filters.</div>
        )}
      </div>
    </main>
  );
}
