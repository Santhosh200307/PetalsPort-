import { useState } from "react";
import axios from "axios";
import { Reveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Thank you — we'll reply within one working day.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Could not send right now. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main data-testid="contact-page" className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[#5C7065]">Contact</div>
          <h1 className="font-serif-display text-5xl md:text-7xl mt-3 leading-[0.95]">
            Drop us<br />a <span className="italic">line</span>.
          </h1>
          <p className="mt-8 text-[#5C7065] leading-relaxed max-w-md">
            For everything from a single bouquet enquiry to a full event quote, we're a phone call (or email) away.
          </p>
          <div className="mt-12 space-y-6 max-w-md">
            <div className="flex items-start gap-4 border-t border-[#E5E0D8] pt-5">
              <Phone size={20} className="text-[#8C2131] mt-0.5" />
              <div>
                <div className="font-serif-display text-xl">+91 98xxx xxxxx</div>
                <div className="text-sm text-[#5C7065] mt-1">Mon–Sat, 8am – 9pm IST</div>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-[#E5E0D8] pt-5">
              <Mail size={20} className="text-[#8C2131] mt-0.5" />
              <div>
                <div className="font-serif-display text-xl">hello@petalsport.in</div>
                <div className="text-sm text-[#5C7065] mt-1">For quotes and trade enquiries</div>
              </div>
            </div>
            <div className="flex items-start gap-4 border-t border-[#E5E0D8] pt-5">
              <MapPin size={20} className="text-[#8C2131] mt-0.5" />
              <div>
                <div className="font-serif-display text-xl">KR Market, Bengaluru</div>
                <div className="text-sm text-[#5C7065] mt-1">Studio · Cold storage · Dispatch</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          <form data-testid="contact-form" onSubmit={handleSubmit} className="bg-white border border-[#E5E0D8] p-8 md:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Name *</label>
                <input data-testid="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Email *</label>
                <input data-testid="contact-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Subject</label>
              <input data-testid="contact-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-[#5C7065]">Message *</label>
              <textarea data-testid="contact-message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full bg-transparent border-b border-[#1A2F24]/30 focus:border-[#1A2F24] outline-none py-3 transition-colors resize-none" />
            </div>
            <button data-testid="contact-submit" type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-[#1A2F24] text-[#FAF8F5] px-8 py-3.5 text-sm hover:bg-[#2C4A3A] transition-colors disabled:opacity-50">
              {submitting ? "Sending…" : "Send Message"} <Send size={16} />
            </button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
