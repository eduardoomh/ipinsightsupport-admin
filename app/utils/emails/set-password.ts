export function renderSetPasswordEmailHTML({
  name,
  setPasswordUrl,
}: {
  name: string;
  setPasswordUrl: string;
}) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Sentinelux IP InsightsSupport</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #1a237e; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">Sentinelux IP InsightsSupport</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px;">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your account has been successfully created in <strong>Sentinelux IP InsightsSupport</strong>.</p>
          <p>To get started, please click the link below to set your password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${setPasswordUrl}" style="background-color: #1a237e; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold; display: inline-block;">
              Set My Password
            </a>
          </p>
          <p>If the button above does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #1a237e;">${setPasswordUrl}</p>
          <br/>
          <p>Best regards,<br/>The Sentinelux IP InsightsSupport Team</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          © ${new Date().getFullYear()} Sentinelux IP InsightsSupport. All rights reserved.
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}