import { useState } from "react";
import axios from "axios";
import { Reveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { CalendarDays, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BulkQuote() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    event_type: "wedding",
    event_date: "",
    location: "",
    guest_count: "",
    budget: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/quote-request`, form);
      setSubmitted(true);
      toast.success("Quote request sent — we'll respond within 4 working hours.");
    } catch (err) {
      toast.error("Could not send right now. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main data-testid="quote-thankyou" className="pt-40 pb-40 min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Received</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-4 leading-none">
            Your brief is <span className="italic">blooming</span>.
          </h1>
          <p className="mt-6 text-[#5C7065]">
            A florist designer will reach out within 4 working hours with a quote, a look-book, and seasonal suggestions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main data-testid="quote-page" className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Bulk Quote</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-3 leading-[0.95]">
            Tell us about<br />the <span className="italic">event</span>.
          </h1>
          <p className="mt-8 text-[#5C7065] leading-relaxed max-w-md">
            Share a brief and we'll come back with a curated quote — stems, structures, suggested palette, and a delivery plan.
          </p>
          <div className="mt-12 space-y-6 max-w-md">
            <div className="flex items-start gap-4 border-t border-[#E5E0D8] pt-5">
              <CalendarDays size={20} className="text-[#8C2131] mt-0.5" />
              <div>
                <div className="font-serif-display text-xl">Response in 4 hours</div>
                <div className="text-sm text-[#5C7065] mt-1">Working days, 9am – 6pm IST</div>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-[#E5E0D8] pt-5">
              <Send size={20} className="text-[#8C2131] mt-0.5" />
              <div>
                <div className="font-serif-display text-xl">Designer brief included</div>
                <div className="text-sm text-[#5C7065] mt-1">Mood board, palette and stem list for your sign-off.</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          <form data-testid="quote-form" onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-8 md:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full name" name="name" value={form.name} onChange={handleChange} required testid="quote-name" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} required testid="quote-email" />
              <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} required testid="quote-phone" />
              <Field label="Company / Studio" name="company" value={form.company} onChange={handleChange} testid="quote-company" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField label="Event type" name="event_type" value={form.event_type} onChange={handleChange} testid="quote-event-type" options={[
                { v: "wedding", l: "Wedding" },
                { v: "birthday", l: "Birthday" },
                { v: "corporate", l: "Corporate" },
                { v: "other", l: "Other" },
              ]}/>
              <Field label="Event date" name="event_date" type="date" value={form.event_date} onChange={handleChange} required testid="quote-event-date" />
              <Field label="Venue / city" name="location" value={form.location} onChange={handleChange} required testid="quote-location" />
              <Field label="Guest count (approx)" name="guest_count" type="number" value={form.guest_count} onChange={handleChange} testid="quote-guests" />
            </div>

            <Field label="Budget (INR)" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. 1,50,000" testid="quote-budget" />

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Notes / mood / inspiration</label>
              <textarea
                data-testid="quote-notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us palette ideas, anchor blooms, references, structural needs (mandap, backdrop, table runners)…"
                className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors resize-none"
              />
            </div>

            <button
              data-testid="quote-submit"
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1A2F24] text-[#FAF8F5] px-9 py-4 text-sm tracking-wide hover:bg-[#2C4A3A] transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Brief"} <Send size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text", required, placeholder, testid }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">{label}{required && " *"}</label>
      <input
        data-testid={testid}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, testid }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">{label}</label>
      <select
        data-testid={testid}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors"
      >
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
