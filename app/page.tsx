"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Small helper to generate a nice animated gradient background + sparkles
function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Soft animated gradient */}
      <div className="absolute inset-0">
        <div className="absolute -inset-[10%] bg-[radial-gradient(60%_60%_at_50%_30%,rgba(99,102,241,0.25),transparent_60%),conic-gradient(from_180deg_at_50%_50%,rgba(56,189,248,0.25),rgba(244,114,182,0.25),rgba(99,102,241,0.25),rgba(56,189,248,0.25))] blur-3xl opacity-60 animate-[spin_40s_linear_infinite]" />
        <div className="absolute -inset-[15%] bg-[radial-gradient(50%_50%_at_20%_80%,rgba(244,114,182,0.2),transparent_60%),radial-gradient(50%_50%_at_80%_20%,rgba(56,189,248,0.2),transparent_60%)] blur-2xl animate-pulse" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px] opacity-20 dark:opacity-10" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.8\\' numOctaves=\\'2\\'/></filter><rect width=\\'100\\' height=\\'100\\' filter=\\'url(%23n)\\'/></svg>')" }} />
    </div>
  );
}

function SparkleTrail() {
  // Simple cursor-following sparkle dots
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-white/70 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          animate={{
            x: pos.x + Math.sin(i) * 20,
            y: pos.y + Math.cos(i) * 20,
            opacity: [0, 1, 0.4, 0.9, 0],
            scale: [0.3, 1, 0.8, 1, 0.3],
          }}
          transition={{ duration: 1.6 + i * 0.04, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(0.2px)" }}
        />
      ))}
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  return (
    <motion.div style={{ scaleX: width }} className="fixed left-0 right-0 top-0 h-1 origin-left bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 z-50" />
  );
}

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const [m, setM] = useState({ x: 0, y: 0 });
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLAnchorElement).getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setM({ x, y });
      }}
      onMouseLeave={() => setM({ x: 0, y: 0 })}
      className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-medium shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/10 border border-white/15 hover:border-white/25 transition-all duration-200 text-white"
      style={{ transform: `translate(${m.x * 0.04}px, ${m.y * 0.04}px)` }}
    >
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/30 to-fuchsia-400/30 opacity-0 blur transition-opacity duration-200 group-hover:opacity-100" />
      <span className="relative">{children}</span>
      <svg className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-balance text-base/7 text-white/80"
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function Page() {
  const { scrollY } = useScroll();
  const y = useSpring(scrollY, { stiffness: 60, damping: 20, mass: 0.6 });
  const heroParallax = useTransform(y, [0, 500], [0, 60]);

  return (
    <div className="relative min-h-screen text-white">
      <BackgroundFX />
      <SparkleTrail />
      <ScrollProgress />

      {/* Nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Image src="/next.svg" alt="logo" width={80} height={18} className="invert" />
          <span className="hidden text-sm text-white/70 sm:block">My Intro</span>
        </div>
        <nav className="flex items-center gap-2">
          <a href="#about" className="rounded-xl px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">About</a>
          <a href="#contact" className="rounded-xl px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <main className="mx-auto w-full max-w-6xl px-6 pt-24">
        <motion.section className="relative min-h-[70vh] grid place-items-center text-center py-20">
          <motion.div style={{ y: heroParallax }} className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Hi, I'm <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">Jacky</span>
              <br />
              <span className="text-white/80">First year Computer Science major</span>
            </motion.h1>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <MagneticButton href="https://nextjs.org/">Explore Next.js</MagneticButton>
              <MagneticButton href="#contact">Contact Me</MagneticButton>
            </div>
          </motion.div>
        </motion.section>
      </main>

      <Section id="about" title="About Me">
        <p>
          I started self-studying how to code when I was a freshman in high school. Building things on the computer has
          always been my dream. I can't wait to create more projects and meet more people!
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "TypeScript",
            "React",
            "Next.js",
            "Tailwind",
            "Framer Motion",
            "Accessibility",
            "Vite",
            "Node.js",
          ].map((skill) => (
            <motion.li
              key={skill}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center text-sm text-white/80 shadow"
            >
              {skill}
            </motion.li>
          ))}
        </ul>
      </Section>

      <Section id="contact" title="Get In Touch">
        <p>
          Say hi and let's make something great together.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <MagneticButton href="mailto:Jliu282@calpoly.edu">Email Me</MagneticButton>
          <MagneticButton href="https://github.com/Aikon1433">GitHub</MagneticButton>
        </div>
      </Section>

      <footer className="mx-auto max-w-6xl px-6 pb-16 text-sm text-white/50">
        © {new Date().getFullYear()} Jacky. Built with Next.js & Framer Motion.
      </footer>
    </div>
  );
}