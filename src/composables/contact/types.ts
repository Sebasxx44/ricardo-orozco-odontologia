export type ContactService =
  | "implantes-dentales"
  | "calzas-blancas"
  | "diseno-de-sonrisa"
  | "rehabilitacion-oral"
  | "aclaramiento-dental"
  | "ortodoncia";
export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
}
export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  service: ContactService;
  message: string;
  consent: true;
}
export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;
export type ContactValidation =
  | { valid: true; request: ContactRequest; errors: ContactErrors }
  | { valid: false; request: null; errors: ContactErrors };
