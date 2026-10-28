import type {
  ContactErrors,
  ContactRequest,
  ContactService,
  ContactValidation,
  ContactValues,
} from "@/composables/contact/types";
export const contactServiceLabels: Record<ContactService, string> = {
  "implantes-dentales": "Implantes dentales",
  "calzas-blancas": "Calzas blancas",
  "diseno-de-sonrisa": "Diseño de sonrisa",
  "rehabilitacion-oral": "Rehabilitación oral",
  "aclaramiento-dental": "Aclaramiento dental",
  ortodoncia: "Ortodoncia",
};
export const isContactService = (value: string): value is ContactService =>
  Object.hasOwn(contactServiceLabels, value);
const cleanLine = (value: string): string => value.trim().replace(/\s+/g, " ");
export const validateContact = (values: ContactValues): ContactValidation => {
  const errors: ContactErrors = {};
  const name = cleanLine(values.name);
  const email = values.email.trim();
  const phone = cleanLine(values.phone);
  const message = values.message.trim();
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 80)
    errors.name = "Escribe tu nombre entre 2 y 80 caracteres.";
  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.length > 160
  )
    errors.email = "Revisa tu correo electrónico.";
  if (
    !/^\+?[\d\s().-]+$/.test(phone) ||
    digits.length < 7 ||
    digits.length > 15
  )
    errors.phone = "Escribe un teléfono válido de 7 a 15 dígitos.";
  if (!isContactService(values.service))
    errors.service = "Selecciona uno de los tratamientos disponibles.";
  if (message.length > 1200)
    errors.message = "El mensaje debe tener como máximo 1200 caracteres.";
  if (!values.consent)
    errors.consent = "Confirma tu autorización antes de preparar la solicitud.";
  if (Object.keys(errors).length || !isContactService(values.service))
    return { valid: false, request: null, errors };
  return {
    valid: true,
    request: {
      name,
      email,
      phone,
      service: values.service,
      message,
      consent: true,
    },
    errors,
  };
};
export const buildContactSummary = (request: ContactRequest): string =>
  [
    `Nombre: ${request.name}`,
    request.email ? `Correo: ${request.email}` : "",
    `Teléfono: ${request.phone}`,
    `Tratamiento de interés: ${contactServiceLabels[request.service]}`,
    request.message ? `Mensaje: ${request.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
export const buildWhatsAppUrl = (
  destination: string,
  request: ContactRequest,
): string | null => {
  const phone = destination.replace(/^\+/, "");
  if (!/^\d{10,15}$/.test(phone)) return null;
  const message = `Hola, consultorio del Dr. Ricardo Orozco. Quisiera solicitar una valoración.\n\n${buildContactSummary(request)}\n\nAutorizo que me contacten para coordinar esta solicitud.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
