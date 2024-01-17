export const VerifyCode = ({
  code,
  name = process.env.APP_NAME,
  logo = process.env.APP_LOGO,
  changePasswordUrl,
  pageUrl = process.env.NEXTAUTH_URL,
}) => {
  const header = `<h1 style="font-size:50px">${name}</h1>`
  //   const header = logo
  //     ? `<img alt="${name}" src="${logo}" width="220" height="100" />`
  //     : `<h1 style="font-size:50px">${name}</h1>`
  return `
    <div style="text-align: center; min-width: 640px; width: 100%; height: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;" bgcolor="#fafafa">
        <table border="0" cellpadding="0" cellspacing="0" style="text-align: center; min-width: 640px; width: 100%; margin: 0; padding: 0;" bgcolor="#fafafa">
            <tbody>
                <tr>
                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; height: 4px; font-size: 4px; line-height: 4px;" bgcolor="#6b4fbb"></td>
                </tr>
                <tr>
                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;">
                    ${header}
                    </td>
                </tr>
                <tr>
                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 640px; border-collapse: separate; border-spacing: 0; margin: 0 auto;">
                            <tbody>
                                <tr>
                                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 3px; overflow: hidden; padding: 18px 25px; border: 1px solid #ededed;" align="left" bgcolor="#fff">
                                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div style="color: #1f1f1f; line-height: 1.25em; max-width: 400px; margin: 0 auto;" align="center">
                                                            <span>
                                                                <h3>
                                                                    Help us protect your account
                                                                </h3>
                                                                <p style="font-size: 0.9em;">
                                                                    Before you sign in, we need to verify your identity. Enter the following code on the sign-in page.
                                                                </p>
                                                            </span>
                                                            <div style="width: 207px; height: 53px; background-color: #f0f0f0; line-height: 53px; font-weight: 700; font-size: 1.5em; color: #303030; margin: 26px 0;">
                                                                ${code}
                                                            </div>
                                                            <span>
                                                                <p style="font-size: 0.75em;">
                                                                    If you have not recently tried to sign into ${name}, we recommend
                                                                    <a href="${changePasswordUrl}" style="color: #3777b0; text-decoration: none;" target="_blank">changing your password</a>
                                                                    to keep your account safe. Your verification code expires after 60 minutes.
                                                                </p>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                
            </tbody>
        </table>
    </div>
    `
}

{
  /* <tr>
                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;">
                        <img
                            alt="${name}"
                            src="https://ci4.googleusercontent.com/proxy/W_bu4ITpmVn2I1KrpY2020CL3GpF4eQtFP9pRPg4CBPZ-3y49c37XAVjph38Ri7e5UDZLlpqrnzlz2Y25c_gKyuUtJ_bNxuLsN1ukc1TVXeUCkN0QqJn80Efx_vaouOVBvjGATjVI0KoqP3MXGgWFqYzI4fPgt2nlNSTnx_aLHoZ6Q_A2lXn-mT8F5644uBn=s0-d-e1-ft#https://gitlab.com/assets/mailers/gitlab_logo_black_text-5430ca955baf2bbce6d3aa856a025da70ac5c9595597537254f665c10beab7a5.png"
                            style="display: none; width: 90px; margin: 0 auto 1em;"
                        />
                        <div>
                            You're receiving this email because of your account on
                            <a
                                rel="noopener noreferrer"
                                href="https://${pageUrl}"
                                style="color: #3777b0; text-decoration: none;"
                                target="_blank"
                            >
                                ${name}
                            </a>
                            . <a href="${pageUrl}" rel="noopener noreferrer" style="color: #3777b0; text-decoration: none;" target="_blank">Manage all notifications</a> ·
                            <a href="${pageUrl}" rel="noopener noreferrer" style="color: #3777b0; text-decoration: none;" target="_blank">Help</a>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;"></td>
                </tr> */
}
export const ResetPassword = ({
  userName,
  name = process.env.APP_NAME,
  logo = process.env.APP_LOGO,
  changePasswordUrl,
  pageUrl = process.env.NEXTAUTH_URL,
}) => {
  const header = `<h1 style="font-size:50px">${name}</h1>`
  //   const header = logo
  //     ? `<img alt="${name}" src="${logo}" width="220" height="100" />`
  //     : `<h1 style="font-size:50px">${name}</h1>`
  console.log(header)
  return `
    <div style="text-align: center; min-width: 640px; width: 100%; height: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;" bgcolor="#fafafa">
    <table border="0" cellpadding="0" cellspacing="0" style="text-align: center; min-width: 640px; width: 100%; margin: 0; padding: 0;" bgcolor="#fafafa">
        <tbody>
            <tr>
                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; height: 4px; font-size: 4px; line-height: 4px;" bgcolor="#6b4fbb"></td>
            </tr>
            <tr>
                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;">
                ${header}
                </td>
            </tr>
            <tr>
                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <table border="0" cellpadding="0" cellspacing="0" style="width: 640px; border-collapse: separate; border-spacing: 0; margin: 0 auto;">
                        <tbody>
                            <tr>
                                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 3px; overflow: hidden; padding: 18px 25px; border: 1px solid #ededed;" align="left" bgcolor="#fff">
                                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                        <tbody>
                                            <tr>
                                                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; font-size: 15px; font-weight: 400; line-height: 1.4; padding: 15px 5px;" align="center">
                                                    <h1 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; font-size: 18px; font-weight: 600; line-height: 1.4; margin: 0; padding: 0;" align="center">
                                                        Hello, ${userName}!
                                                    </h1>
                                                    <p>Someone, hopefully you, has requested to reset the password for your ${name} account on <a href="${pageUrl}" target="_blank">${pageUrl}</a>.</p>
                                                    <p>
                                                        If you did not perform this request, you can safely ignore this email.
                                                    </p>
                                                    <p>
                                                        Otherwise, click the link below to complete the process.
                                                    </p>
                                                    <div>
                                                        <a href="${changePasswordUrl}" style="color: #3777b0; text-decoration: none;" target="_blank">Reset password</a>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

            
        </tbody>
    </table>
</div>

      `
}

{
  /* <tr>
                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c;">
                    <div>
                        Everyone can contribute
                    </div>
                    <div>
                        <a style="color: #3777b0; text-decoration: none;" href="#" target="_blank">Blog</a>
                        ·
                        <a style="color: #3777b0; text-decoration: none;" href="#" target="_blank">Twitter</a>
                        ·
                        <a style="color: #3777b0; text-decoration: none;" href="#" target="_blank">Facebook</a>
                        ·
                        <a style="color: #3777b0; text-decoration: none;" href="#" target="_blank">YouTube</a>
                        ·
                        <a style="color: #3777b0; text-decoration: none;" href="#" target="_blank">LinkedIn</a>
                    </div>
                </td>
            </tr>

            <tr>
                <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;"></td>
            </tr> */
}

export const SendPassword = ({
  code,
  name = process.env.APP_NAME,
  logo = process.env.APP_LOGO,
  changePasswordUrl,
  pageUrl = process.env.NEXTAUTH_URL,
}) => {
  const header = `<h1 style="font-size:50px">${name}</h1>`
  return `
      <div style="text-align: center; min-width: 640px; width: 100%; height: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;" bgcolor="#fafafa">
          <table border="0" cellpadding="0" cellspacing="0" style="text-align: center; min-width: 640px; width: 100%; margin: 0; padding: 0;" bgcolor="#fafafa">
              <tbody>
                  <tr>
                      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; height: 4px; font-size: 4px; line-height: 4px;" bgcolor="#6b4fbb"></td>
                  </tr>
                  <tr>
                      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; padding: 25px 0;">
                      ${header}
                      </td>
                  </tr>
                  <tr>
                      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                          <table border="0" cellpadding="0" cellspacing="0" style="width: 640px; border-collapse: separate; border-spacing: 0; margin: 0 auto;">
                              <tbody>
                                  <tr>
                                      <td style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; border-radius: 3px; overflow: hidden; padding: 18px 25px; border: 1px solid #ededed;" align="left" bgcolor="#fff">
                                          <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                              <tbody>
                                                  <tr>
                                                      <td>
                                                          <div style="color: #1f1f1f; line-height: 1.25em; max-width: 400px; margin: 0 auto;" align="center">
                                                              <span>
                                                                  <h3>
                                                                  Congratulations! Your new account has been successfully created!
                                                                  </h3>
                                                                  <p style="font-size: 0.9em;">
                                                                      Use these password for your first login:
                                                                  </p>
                                                              </span>
                                                              <div style="width: 207px; height: 53px; background-color: #f0f0f0; line-height: 53px; font-weight: 700; font-size: 1.5em; color: #303030; margin: 26px 0;">
                                                                  ${code}
                                                              </div>
                                                              <span>
                                                                  <p style="font-size: 0.75em;">
                                                                      If you have not recently tried to sign into ${name}, we recommend
                                                                      <a href="${changePasswordUrl}" style="color: #3777b0; text-decoration: none;" target="_blank">changing your password</a>
                                                                      to keep your account safe. Your verification code expires after 60 minutes.
                                                                  </p>
                                                              </span>
                                                          </div>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
  
                  
              </tbody>
          </table>
      </div>
      `
}
