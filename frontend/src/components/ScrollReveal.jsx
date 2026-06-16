import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 40, className = "", as: Tag = "div" }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SplitWords({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={`inline-block ${className}`}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.08 }}
        >
          {w}{i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </span>
  );
}
