'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { SpendForm } from '@/components/SpendForm';
import { ShieldCheck, TrendingDown, Share2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-6 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 45, 0], y: [0, -35, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
          />

          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[-140px] top-[350px] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          />

          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
          />
        </div>

        <section className="relative z-10 overflow-hidden py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-200 shadow-2xl backdrop-blur-xl"
            >
              Free AI spend audit for startup teams
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-black tracking-tight md:text-7xl"
            >
              Stop overpaying for AI tools.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400"
            >
              Enter your AI stack and get an instant, finance-literate audit
              with plan downgrades, alternatives, and potential savings.
            </motion.p>

            <motion.a
              href="#audit"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-bold text-black shadow-2xl transition-all duration-300 hover:bg-zinc-200"
            >
              Audit my AI spend
            </motion.a>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3"
        >
          {[
            [
              TrendingDown,
              'Savings math',
              'Clear monthly and annual savings, not vague advice.',
            ],
            [
              ShieldCheck,
              'Defensible logic',
              'Hardcoded rules with official pricing sources.',
            ],
            [
              Share2,
              'Shareable report',
              'Unique public URL and link-preview ready result page.',
            ],
          ].map(([Icon, title, desc], index) => {
            const I = Icon as typeof TrendingDown;

            return (
              <motion.div
                key={String(title)}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
              >
                <I className="mb-3 text-indigo-300" />

                <h3 className="font-bold text-white">{String(title)}</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {String(desc)}
                </p>
              </motion.div>
            );
          })}
        </motion.section>

        <motion.div
          id="audit"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-6xl"
        >
          <SpendForm onResult={(id) => router.push(`/audit/${id}`)} />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mx-auto mt-12 max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
        >
          <h2 className="text-2xl font-bold text-white">FAQ</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <p className="text-zinc-400">
              <b className="text-white">Do I need to log in?</b>
              <br />
              No. Email is only requested after the audit.
            </p>

            <p className="text-zinc-400">
              <b className="text-white">Is the math AI-generated?</b>
              <br />
              No. Audit math uses deterministic rules; AI only writes the
              summary.
            </p>

            <p className="text-zinc-400">
              <b className="text-white">What tools are supported?</b>
              <br />
              Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API,
              Gemini, and v0.
            </p>

            <p className="text-zinc-400">
              <b className="text-white">Is this private?</b>
              <br />
              Public share links remove email and company details.
            </p>
          </div>
        </motion.section>
      </main>
    </>
  );
}