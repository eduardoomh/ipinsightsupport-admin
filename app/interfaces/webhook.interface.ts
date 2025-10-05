export interface WebhookEmailEvent {
    created_at: string; // fecha del evento principal (ISO 8601)
    type: string;       // tipo de evento, ej. "email.sent"
    data: {
      created_at: string;   // fecha de creación del email (timestamp)
      email_id: string;     // identificador único del email
      from: string;         // remitente
      subject: string;      // asunto del email
      to: string[];         // lista de destinatarios
    };
  }