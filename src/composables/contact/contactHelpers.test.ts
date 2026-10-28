import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildContactSummary,
  buildWhatsAppUrl,
  isContactService,
  validateContact,
} from "./contactHelpers.ts";
import type {
  ContactRequest,
  ContactValues,
} from "@/composables/contact/types";
const valid: ContactValues = {
  name: "  Ana María  ",
  email: "ana@example.com",
  phone: "+57 314 555 1234",
  service: "ortodoncia",
  message: "Quiero conocer las opciones disponibles.",
  consent: true,
};
const request = (): ContactRequest => {
  const result = validateContact(valid);
  assert.equal(result.valid, true);
  if (!result.valid) throw new Error("La solicitud de prueba debe ser válida");
  return result.request;
};
test("normaliza datos locales y conserva caracteres españoles", () => {
  const value = request();
  assert.equal(value.name, "Ana María");
  assert.equal(value.phone, "+57 314 555 1234");
  assert.equal(value.service, "ortodoncia");
});
test("el consentimiento y un teléfono válido son obligatorios", () => {
  const result = validateContact({ ...valid, consent: false, phone: "abc" });
  assert.equal(result.valid, false);
  assert.ok(result.errors.consent);
  assert.ok(result.errors.phone);
});
test("rechaza correo inválido, nombre vacío y servicio ajeno al catálogo", () => {
  const result = validateContact({
    ...valid,
    name: " ",
    email: "ana@",
    service: "servicio-inventado",
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.service);
  assert.equal(isContactService("__proto__"), false);
});
test("correo obligatorio y mensaje opcional respetan el formulario", () => {
  assert.equal(validateContact({ ...valid, email: "" }).valid, false);
  const result = validateContact({ ...valid, message: "" });
  assert.equal(result.valid, true);
  if (result.valid)
    assert.equal(
      buildContactSummary(result.request).includes("Mensaje:"),
      false,
    );
});
test("limita longitud de datos y teléfonos antes de preparar WhatsApp", () => {
  const result = validateContact({
    ...valid,
    name: "a".repeat(81),
    phone: "1234567890123456",
    message: "a".repeat(1201),
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.message);
});
test("el enlace apunta exclusivamente a WhatsApp y codifica texto completo", () => {
  const url = buildWhatsAppUrl("573146612227", request());
  assert.ok(url);
  if (!url) throw new Error("No se generó el enlace esperado");
  const parsed = new URL(url);
  assert.equal(parsed.origin, "https://wa.me");
  assert.equal(parsed.pathname, "/573146612227");
  assert.ok(parsed.searchParams.get("text")?.includes("Ana María"));
  assert.ok(parsed.searchParams.get("text")?.includes("Ortodoncia"));
  assert.ok(parsed.searchParams.get("text")?.includes("Autorizo"));
});
test("símbolos y HTML del mensaje se codifican como texto sin parámetros extra", () => {
  const value = {
    ...request(),
    message: "Consulta & revisión + <script>alert(1)</script> #salud",
  };
  const url = buildWhatsAppUrl("+573146612227", value);
  assert.ok(url);
  if (!url) throw new Error("No se generó el enlace esperado");
  const parsed = new URL(url);
  assert.deepEqual([...parsed.searchParams.keys()], ["text"]);
  assert.ok(parsed.searchParams.get("text")?.includes(value.message));
});
test("destinos malformados no producen un enlace de navegación", () => {
  for (const phone of [
    "javascript:alert(1)",
    "57314?text=otro",
    "123",
    "https://example.com",
    "573146612227&x=1",
  ])
    assert.equal(buildWhatsAppUrl(phone, request()), null);
});
