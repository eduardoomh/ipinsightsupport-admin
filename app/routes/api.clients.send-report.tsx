// app/routes/clients/send-report.tsx
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Resend } from "resend";
import { renderCompanyReportEmailHTML } from "~/utils/emails/send-company-report";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, pdfBase64, filename, company, startDate, endDate, recipientName } = body;

    if (!email || !pdfBase64) {
      return json({ error: "Missing required fields (email, pdfBase64)" }, { status: 400 });
    }

    // Genera el HTML dinámico usando tu plantilla
    const html = renderCompanyReportEmailHTML({
      recipientName: recipientName || "Customer",
      company,
      startDate,
      endDate,
      // reportLink opcional si quieres agregar un link alternativo
    });

    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: email,
      subject: `Company Report for ${company}`,
      html,
      attachments: [
        {
          filename: filename || `${company}-report.pdf`,
          content: pdfBase64,
        },
      ],
    });

    return json({ success: true, message: `Report sent to ${email}` });
  } catch (error) {
    console.error("Error sending report email:", error);
    return json({ error: "Failed to send report email" }, { status: 500 });
  }
};