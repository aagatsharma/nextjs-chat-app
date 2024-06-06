import config from "@/config/config"
import nodemailer from "nodemailer"

type EmailPayload = {
  to: string
  subject: string
  html: string
}

// Replace with your SMTP credentials
const smtpOptions = {
  host: config.email.smtp.host ,
  port: parseInt(config.email.smtp.port ),
  secure: true,
  auth: {
    user: config.email.smtp.auth.user ,
    pass: config.email.smtp.auth.pass,
  },
}

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  })

  return await transporter.sendMail({
    from: config.email.from,
    ...data,
  })
}