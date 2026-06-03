'use client';

import { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  PRICING,
  TOOL_LABELS,
  type ToolKey,
  type UseCase,
} from '@/data/pricing';
import type { AuditInput, SpendItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const defaultItem = (): SpendItem => ({
  id: nanoid(6),
  tool: 'chatgpt',
  plan: 'Team',
  monthlySpend: 90,
  seats: 3,
});

const storageKey = 'spendscope-form-v1';

const loadingMessages = [
  'Analyzing your AI stack...',
  'Checking pricing overlaps...',
  'Calculating savings...',
  'Generating recommendations...',
];

export function SpendForm({
  onResult,
}: {
  onResult: (id: string) => void;
}) {
  const [teamSize, setTeamSize] = useState(3);
  const [useCase, setUseCase] = useState<UseCase>('coding');
  const [items, setItems] = useState<SpendItem[]>([defaultItem()]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      const parsed = JSON.parse(saved) as AuditInput;
      setTeamSize(parsed.teamSize || 3);
      setUseCase(parsed.useCase || 'coding');
      setItems(parsed.items?.length ? parsed.items : [defaultItem()]);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ teamSize, useCase, items })
    );
  }, [teamSize, useCase, items]);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1400);

    return () => clearInterval(interval);
  }, [loading]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.monthlySpend, 0),
    [items]
  );

  async function submit() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize, useCase, items }),
      });

      if (!res.ok) throw new Error('Audit failed');

      const data = await res.json();

      setTimeout(() => {
        onResult(data.id);
      }, 1800);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <section
      id="audit"
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl md:p-8"
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent"
            />

            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-lg font-semibold text-white"
            >
              {loadingMessages[messageIndex]}
            </motion.p>

            <p className="mt-2 text-sm text-zinc-400">
              This usually takes a few seconds
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-300">
            Free AI Spend Audit
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Enter your AI stack
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Add your AI tools, plans, monthly spend, and seats.
          </p>
        </div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white"
        >
          <span className="font-semibold">Current spend:</span> ${total}/mo
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-zinc-300">
            Team size
          </span>

          <input
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
            type="number"
            value={teamSize}
            min={1}
            onChange={(e) => setTeamSize(Number(e.target.value))}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-300">
            Primary use case
          </span>

          <select
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase)}
          >
            {['coding', 'writing', 'data', 'research', 'mixed'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <motion.div
            layout
            key={item.id}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition-all duration-300 hover:border-indigo-400/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <b className="text-white">Tool {index + 1}</b>

              <button
                disabled={loading}
                className="text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
                onClick={() =>
                  setItems(items.filter((i) => i.id !== item.id))
                }
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <select
                disabled={loading}
                className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
                value={item.tool}
                onChange={(e) => {
                  const tool = e.target.value as ToolKey;
                  const plan = PRICING[tool][0].name;

                  setItems(
                    items.map((i) =>
                      i.id === item.id ? { ...i, tool, plan } : i
                    )
                  );
                }}
              >
                {Object.entries(TOOL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                disabled={loading}
                className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
                value={item.plan}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id
                        ? { ...i, plan: e.target.value }
                        : i
                    )
                  )
                }
              >
                {PRICING[item.tool].map((plan) => (
                  <option key={plan.name}>{plan.name}</option>
                ))}
              </select>

              <input
                disabled={loading}
                className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
                type="number"
                min={0}
                value={item.monthlySpend}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id
                        ? { ...i, monthlySpend: Number(e.target.value) }
                        : i
                    )
                  )
                }
                placeholder="Monthly spend"
              />

              <input
                disabled={loading}
                className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
                type="number"
                min={1}
                value={item.seats}
                onChange={(e) =>
                  setItems(
                    items.map((i) =>
                      i.id === item.id
                        ? { ...i, seats: Number(e.target.value) }
                        : i
                    )
                  )
                }
                placeholder="Seats"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
          onClick={() => setItems([...items, defaultItem()])}
        >
          Add another tool
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={submit}
          className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-2xl shadow-indigo-500/20 transition-all duration-300 hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Run free audit'}
        </motion.button>
      </div>
    </section>
  );
}