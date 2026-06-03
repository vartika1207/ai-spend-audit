'use client';

import { useState } from 'react';

export function LeadCapture({
  auditId,
  monthlySavings,
}: {
  auditId: string;
  monthlySavings: number;
}) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [website, setWebsite] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auditId,
        email,
        companyName,
        role,
        monthlySavings,
        website,
      }),
    });

    setSent(true);
  }

  if (sent)
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
        <b className="text-white">Report captured.</b>

        <p className="mt-2 text-sm text-zinc-400">
          Check your email for the audit link.
        </p>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
    >
      <h3 className="text-xl font-bold text-white">
        Save this report
      </h3>

      <p className="mb-5 mt-2 text-sm text-zinc-400">
        No email required before value. Add it now to receive the report.
      </p>

      <input
        className="hidden"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <input
          required
          type="email"
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
          placeholder="Company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <button className="mt-5 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-500">
        Email me the report
      </button>
    </form>
  );
}
