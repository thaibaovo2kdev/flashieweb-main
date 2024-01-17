import nodemailer from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
// const Mailgun = require('mailgun.js')

// const mailgun = new Mailgun(formData)
// const mg = mailgun.client({
//   username: 'api',
//   key: '<PRIVATE_API_KEY>',
// })

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN
const GOOGLE_ADMIN_EMAIL_ADDRESS = process.env.GOOGLE_ADMIN_EMAIL_ADDRESS

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)

myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
})

export const sendMail = async ({ to, subject, html }) => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken()
    const myAccessToken = myAccessTokenObject?.token
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GOOGLE_ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    })
    // console.log({ to, subject, html })

    const res = await transport.sendMail({
      from: GOOGLE_ADMIN_EMAIL_ADDRESS,
      to,
      subject,
      html,
    })

    console.log(res)
    return
  } catch (error) {
    console.log(error)
    return error
  }
}
