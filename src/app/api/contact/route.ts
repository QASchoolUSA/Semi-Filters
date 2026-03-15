import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    const subjectLabels: Record<string, string> = {
      'product-inquiry': 'Product Inquiry',
      'order-support': 'Order Support',
      'bulk-pricing': 'Bulk / Fleet Pricing',
      'compatibility': 'Compatibility Question',
      'returns': 'Returns & Warranty',
      'other': 'Other',
    }

    const readableSubject = subjectLabels[subject] || subject

    await sendEmail({
      to: 'support@semifilters.com',
      replyTo: email,
      subject: `[Contact Form] ${readableSubject} — ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px;">
          <h2 style="margin:0 0 20px; color:#111;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:8px 12px; font-weight:600; color:#555; width:100px;">Name</td>
              <td style="padding:8px 12px;">${name}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px 12px; font-weight:600; color:#555;">Email</td>
              <td style="padding:8px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px; font-weight:600; color:#555;">Phone</td>
              <td style="padding:8px 12px;">${phone || '—'}</td>
            </tr>
            <tr style="background:#f9f9f9;">
              <td style="padding:8px 12px; font-weight:600; color:#555;">Subject</td>
              <td style="padding:8px 12px;">${readableSubject}</td>
            </tr>
          </table>
          <div style="margin-top:20px; padding:16px; background:#f5f5f5; border-radius:8px;">
            <p style="margin:0; white-space:pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
