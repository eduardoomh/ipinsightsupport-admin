export function renderRecoverEmailHTML({
  name,
  email,
  resetUrl,
}: {
  name: string;
  email: string;
  resetUrl: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hola ${name || "usuario"},</h2>
      <p>Recibimos una solicitud para restablecer la contraseña asociada a este correo: <strong>${email}</strong>.</p>
      <p>Para continuar, haz clic en el siguiente botón o copia el enlace en tu navegador:</p>
      <a href="${resetUrl}" style="background-color: #2d72d9; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px;">Restablecer contraseña</a>
      <p style="margin-top: 20px;">Este enlace expirará en 24 horas. Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      <p style="margin-top: 30px;">Saludos,<br>Equipo Chamosa</p>
    </div>
  `;
}