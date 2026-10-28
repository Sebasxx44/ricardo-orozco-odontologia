import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampProgress,
  heroShift,
  nodeProgress,
  pageProgress,
} from "./progress.ts";
test("el recorrido permanece en0..1 entre inicio y final del documento", () => {
  assert.equal(pageProgress(0, 800, 4000), 0);
  assert.equal(pageProgress(1600, 800, 4000), 0.5);
  assert.equal(pageProgress(3200, 800, 4000), 1);
  assert.equal(pageProgress(-40, 800, 4000), 0);
  assert.equal(pageProgress(9000, 800, 4000), 1);
});
test("un documento sin desplazamiento muestra el camino completo", () => {
  assert.equal(pageProgress(0, 900, 700), 1);
  assert.equal(pageProgress(0, 900, 900), 1);
});
test("nodos fuera de vista y recorridos completos se limitan sin valores inválidos", () => {
  assert.equal(nodeProgress(1000, 500, 800), 0);
  assert.equal(nodeProgress(-1000, 500, 800), 1);
  assert.equal(nodeProgress(0, 500, 0), 0);
  assert.equal(clampProgress(Number.NaN), 0);
});
test("el parallax es pequeño y nunca excede24px", () => {
  assert.equal(heroShift(0), 0);
  assert.equal(heroShift(-200), 12);
  assert.equal(heroShift(-900), 24);
  assert.equal(heroShift(900), -24);
  assert.equal(heroShift(Number.NaN), 0);
});
