import {
  buildContactSummary,
  buildWhatsAppUrl,
  isContactService,
  validateContact,
} from "@/composables/contact/contactHelpers";
import type { ContactField, ContactValues } from "@/composables/contact/types";
const fieldNames: ContactField[] = [
  "name",
  "email",
  "phone",
  "service",
  "message",
  "consent",
];
type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const control = (
  form: HTMLFormElement,
  name: ContactField,
): FormControl | null => {
  const element = form.elements.namedItem(name);
  return element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
    ? element
    : null;
};
const readValues = (form: HTMLFormElement): ContactValues => {
  const data = new FormData(form);
  const text = (name: ContactField): string => {
    const value = data.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    service: text("service"),
    message: text("message"),
    consent: data.has("consent"),
  };
};
export const initContact = (): (() => void) => {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const review = document.querySelector<HTMLElement>("#contact-review");
  const summary = document.querySelector<HTMLElement>("#contact-summary");
  const whatsapp =
    document.querySelector<HTMLAnchorElement>("#contact-whatsapp");
  const edit = document.querySelector<HTMLButtonElement>("[data-edit-request]");
  const status = document.querySelector<HTMLElement>("#contact-status");
  if (
    !form ||
    !review ||
    !summary ||
    !whatsapp ||
    !edit ||
    !status ||
    form.dataset.contactReady === "true"
  )
    return () => {};
  form.dataset.contactReady = "true";
  const initialService = new URLSearchParams(window.location.search).get(
    "servicio",
  );
  const service = control(form, "service");
  if (initialService && isContactService(initialService) && service)
    service.value = initialService;
  const clearValidity = (event: Event) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLTextAreaElement
    )
      event.target.setCustomValidity("");
    status.textContent = "";
  };
  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    fieldNames.forEach((field) => control(form, field)?.setCustomValidity(""));
    if (!form.reportValidity()) return;
    const result = validateContact(readValues(form));
    if (!result.valid) {
      fieldNames.forEach((field) => {
        const message = result.errors[field];
        if (message) control(form, field)?.setCustomValidity(message);
      });
      const first = fieldNames.find((field) => result.errors[field]);
      status.textContent = first
        ? (result.errors[first] ?? "Revisa los campos de la solicitud.")
        : "Revisa los campos de la solicitud.";
      if (first) control(form, first)?.focus();
      form.reportValidity();
      return;
    }
    const url = buildWhatsAppUrl(form.dataset.whatsapp ?? "", result.request);
    if (!url) {
      status.textContent =
        "No se pudo preparar WhatsApp. Puedes usar los datos de contacto del consultorio.";
      return;
    }
    summary.textContent = buildContactSummary(result.request);
    whatsapp.href = url;
    form.hidden = true;
    review.hidden = false;
    review.setAttribute("tabindex", "-1");
    review.setAttribute("role", "region");
    review.setAttribute("aria-label", "Revisión de la solicitud");
    status.textContent =
      "Tu solicitud está lista para revisar. Aún no se ha enviado.";
    review.focus();
  };
  const onEdit = () => {
    review.hidden = true;
    form.hidden = false;
    whatsapp.removeAttribute("href");
    status.textContent = "Puedes editar tu solicitud antes de continuar.";
    control(form, "name")?.focus();
  };
  form.addEventListener("submit", onSubmit);
  form.addEventListener("input", clearValidity);
  form.addEventListener("change", clearValidity);
  edit.addEventListener("click", onEdit);
  const submit = form.querySelector<HTMLButtonElement>("[data-contact-submit]");
  if (submit) submit.disabled = false;
  return () => {
    form.removeEventListener("submit", onSubmit);
    form.removeEventListener("input", clearValidity);
    form.removeEventListener("change", clearValidity);
    edit.removeEventListener("click", onEdit);
    if (submit) submit.disabled = true;
    delete form.dataset.contactReady;
  };
};
