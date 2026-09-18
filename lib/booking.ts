/**
 * Resolves the booking / direct meeting URL
 * Uses NEXT_PUBLIC_BOOKING_URL if configured (e.g. Cal.com, Calendly)
 * Otherwise falls back to an email link to contacto@aurenis.cl with prefilled subject and body
 */
export function getBookingUrl(contextOrPlan?: string): string {
  const envUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  const subject = encodeURIComponent(
    contextOrPlan
      ? `Agendar Demostración Aurenis - ${contextOrPlan}`
      : "Agendar Demostración Aurenis"
  );
  const body = encodeURIComponent(
    `Hola equipo de Aurenis,\n\nMe gustaría agendar una breve videollamada de demostración para evaluar la plataforma en nuestro establecimiento educacional.\n\nNombre:\nColegio / RBD:\nCargo (Director / Jefe UTP / Administrador):\nCantidad aprox. de alumnos:\nTeléfono de contacto:\n\nQuedo atento a su disponibilidad.`
  );

  return `mailto:contacto@aurenis.cl?subject=${subject}&body=${body}`;
}
