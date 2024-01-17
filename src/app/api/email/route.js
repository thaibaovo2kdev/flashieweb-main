import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const GOOGLE_ADMIN_EMAIL_ADDRESS = process.env.GOOGLE_ADMIN_EMAIL_ADDRESS;

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
});

export async function POST(request) {
  // const formData = await request.formData();
  // const subject = formData.get("name");
  // const email = formData.get("email");
  // const content = formData.get("content");

  try {
    // Lấy thông tin gửi lên từ client qua body
    // const { email, subject, content } = req.body
    // if (!email || !subject || !content) throw new Error('Please provide email, subject and content!')
    /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
    const myAccessToken = myAccessTokenObject?.token;
    // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GOOGLE_ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    });
    // mailOption là những thông tin gửi từ phía client lên thông qua API
    const mailOptions = {
      to: "hienvinh24@gmail.com", // Gửi đến ai?
      subject: "Next13 test", // Tiêu đề email
      html: `<h3>${"content"}</h3>`, // Nội dung email
    };
    // Gọi hành động gửi email
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: "Success: email was sent" });
  } catch (error) {
    // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client
    console.log(error);
    return NextResponse.status(500).json({ errors: error.message });
  }
}
