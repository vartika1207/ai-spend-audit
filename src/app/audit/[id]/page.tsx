import type { Metadata } from 'next';
import { getAudit } from '@/lib/storage';
import { Results } from '@/components/Results';
import { Header } from '@/components/Header';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  const savings = audit?.totalMonthlySavings ?? 0;
  return {
    title: `AI Spend Audit: save $${savings}/mo`,
    description: `This AI stack could save $${savings}/month.`,
    openGraph: { title: `AI Spend Audit: save $${savings}/mo`, description: `See the public AI tool spend audit.`, type: 'website' },
    twitter: { card: 'summary_large_image', title: `AI Spend Audit: save $${savings}/mo`, description: 'Public AI spend audit result.' },
  };
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
 if (!audit)
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 px-6 py-12 text-white">
        <div className="card p-8">
          <h1 className="text-2xl font-bold">Audit not found</h1>

          <p className="text-slate-600">
            This report may have expired or was created without persistent database storage.
          </p>
        </div>
      </main>
    </>
  );
  return <><Header /><Results result={audit} /></>;
}
