export function renderCompanyReportEmailHTML({
    recipientName,
    company,
    startDate,
    endDate,
  }: {
    recipientName: string;
    company: string;
    startDate: string;
    endDate: string;
  }) {
    return `
    <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Company Report | Sentinelux</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          table {
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            margin: 0 auto;
          }
          img {
            border: 0;
            outline: none;
            text-decoration: none;
            display: block;
            max-width: 100%;
            height: auto;
          }
          .container {
            width: 100%;
            background-color: #f4f4f4;
            padding: 20px 0;
          }
          .content {
            max-width: 600px;
            background-color: #ffffff;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          }
          .header {
            background-color: #ffffff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e0e0;
          }
          .logo {
            height: 40px;
          }
          .badge {
            padding: 8px 16px;
            border: 2px solid #00aae7;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #00aae7;
          }
          .body-content {
            padding: 30px;
            text-align: center;
            color: #000000;
          }
          .body-content h2 {
            color: #00aae7;
            font-size: 20px;
            margin-bottom: 15px;
          }
          .body-content p {
            font-size: 16px;
            line-height: 1.6;
            margin: 10px 0;
          }
          .footer {
            padding: 20px;
            font-size: 14px;
            color: #000000;
            text-align: center;
            background-color: #ffffff;
            border-top: 1px solid #e0e0e0;
          }
          @media only screen and (max-width: 600px) {
            .body-content {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-bottom:1px solid #e0e0e0;">
              <tr>
                <td align="left" valign="middle" style="padding:20px;">
                  <img src="https://es.ipinsightsupport.com/wp-content/uploads/2025/08/1.png"
                       alt="IP Insight Support Logo"
                       width="180"
                       style="display:block; width:180px; height:auto; border:0; outline:none; text-decoration:none;">
                </td>
                <td align="right" valign="middle" style="padding:20px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="border-collapse:collapse;">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="border:2px solid #00aae7; border-radius:8px; padding:8px 16px; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight:600; font-size:14px; color:#00aae7; text-align:center; display:inline-block;">
                        SENTINELUX
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
  
            <div class="body-content">
              <h2>Hello, ${recipientName}</h2>
              <p>We are pleased to share the report for <strong>${company}</strong> covering the period from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
              <p>The report includes details of hours billed, hours spent, and the total balance. Please find the report attached to this email.</p>
            </div>
  
            <div class="footer">
              <p>Best regards,<br /><strong>The Sentinelux Team</strong></p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
  }