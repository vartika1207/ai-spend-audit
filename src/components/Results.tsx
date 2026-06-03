'use client';

import CountUp from 'react-countup';
import type { AuditResult } from '@/lib/types';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';
import { LeadCapture } from './LeadCapture';

export function Results({ result }: { result: AuditResult }) {
  const shareUrl = `/audit/${result.id}`;

  const data = result.recommendations.map((r) => ({
    name: r.toolLabel,
    Current: r.currentSpend,
    Recommended: r.recommendedSpend,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 35, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[-120px] top-96 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20 md:p-10"
        >
          <p className="text-sm font-semibold text-indigo-300">Audit result</p>

          <div className="mt-3 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
                Save $
                <CountUp end={result.totalMonthlySavings} duration={1.8} />
                /mo
              </h1>

              <p className="mt-4 text-lg text-zinc-400">
                Estimated annual savings:{' '}
                <b className="text-white">
                  $
                  <CountUp end={result.totalAnnualSavings} duration={1.8} />
                </b>
              </p>

              <p className="mt-6 max-w-2xl leading-7 text-zinc-300">
                {result.summary}
              </p>
            </div>

            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white shadow-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
            >
              <p className="text-sm text-zinc-400">Current spend</p>

              <p className="text-4xl font-black">
                $
                <CountUp end={result.totalMonthlySpend} duration={1.8} />
              </p>

              <p className="mt-5 text-sm text-zinc-400">Recommended spend</p>

              <p className="text-4xl font-black">
                $
                <CountUp end={result.totalRecommendedSpend} duration={1.8} />
              </p>
            </motion.div>
          </div>

          {result.status === 'high_savings' && (
            <div className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-5 text-indigo-100">
              <b>Credex opportunity:</b> Your savings are above $500/mo, so
              discounted AI infrastructure credits may capture savings without
              disrupting your team.
            </div>
          )}

          {result.status === 'optimal' && (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-emerald-100">
              <b>You’re spending well.</b> We did not find major overspend in
              this stack.
            </div>
          )}
        </motion.section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
          >
            <h2 className="mb-4 text-xl font-bold text-white">
              Spend comparison
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="Current" fill="#818cf8" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="Recommended"
                    fill="#22c55e"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="space-y-4">
            {result.recommendations.map((r) => (
              <motion.div
                key={r.itemId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.01 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white">{r.toolLabel}</h3>

                    <p className="text-sm text-zinc-400">
                      {r.currentPlan} → {r.recommendedPlan}
                    </p>
                  </div>

                  <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
                    ${r.savingsMonthly}/mo
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  <b className="text-white">{r.action}.</b> {r.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-6"
        >
          <LeadCapture
            auditId={result.id}
            monthlySavings={result.totalMonthlySavings}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:shadow-indigo-500/20"
        >
          <h3 className="font-bold text-white">Shareable public URL</h3>

          <p className="mt-2 break-all text-sm text-zinc-400">{shareUrl}</p>
        </motion.section>
      </div>
    </main>
  );
}