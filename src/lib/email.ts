import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'mail.spacemail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string
  subject: string
  html: string
  replyTo?: string
}) {
  return transporter.sendMail({
    from: `"Semi Filters" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  })
}
