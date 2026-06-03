import { Resend } from 'resend';

export async function sendAuditEmail(to: string, auditUrl: string, savings: number) {
  if (!process.env.RESEND_API_KEY) return { ok: true, skipped: true };
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.AUDIT_EMAIL_FROM || 'AI Spend Audit <onboarding@resend.dev>',
    to,
    subject: 'Your AI Spend Audit report',
    html: `<p>Your audit is ready: <a href="${auditUrl}">${auditUrl}</a></p><p>Estimated monthly savings: <strong>$${savings}</strong>.</p><p>${savings > 500 ? 'Credex may be able to help capture these savings through discounted AI credits.' : 'We will notify you when new optimization opportunities apply.'}</p>`,
  });
}
