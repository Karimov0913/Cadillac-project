import test from "node:test";
import assert from "node:assert/strict";
import { calculateFuel, paints, interiors, comparison } from "../js/data.js";
test("six unique paints / four interiors", () => {
  assert.equal(new Set(paints.map((p) => p.id)).size, 6);
  assert.equal(interiors.length, 4);
});
test("fuel calculation uses distance-weighted consumption", () => {
  const r = calculateFuel(15000, 1.25, 60, 16);
  const expected =
    (15000 / 100) * ((0.6 * 235.214583) / 11 + (0.4 * 235.214583) / 16) * 1.25;
  assert.ok(Math.abs(r.cost - expected) < 1e-8);
  assert.ok(r.cost > 3500 && r.cost < 3600);
});
test("zero distance or price produces zero cost", () => {
  assert.equal(calculateFuel(0, 1.25, 60).cost, 0);
  assert.equal(calculateFuel(15000, 0, 60).cost, 0);
});
test("city and highway extremes", () => {
  assert.equal(calculateFuel(100, 1, 100).l100, 235.214583 / 11);
  assert.equal(calculateFuel(100, 1, 0).l100, 235.214583 / 16);
  assert.ok(
    calculateFuel(15000, 1.25, 0, 17).cost <
      calculateFuel(15000, 1.25, 0, 16).cost,
  );
});
test("three comparable columns for each row", () => {
  assert.ok(comparison.every((r) => r.values.length === 3));
});
import { scenes } from "../js/data.js";
test("five photographed full-screen scenes", () => {
  assert.equal(scenes.length, 5);
  assert.equal(new Set(scenes.map((s) => s.id)).size, 5);
  assert.ok(scenes.every((s) => s.image.endsWith(".webp") && s.title && s.alt));
});
test("paint and interior previews use real local images", () => {
  assert.ok([...paints, ...interiors].every((s) => s.image.endsWith(".webp")));
  assert.ok(
    paints
      .find((s) => s.id === "blue")
      .finish.toLowerCase()
      .includes("custom") ||
      paints
        .find((s) => s.id === "blue")
        .finish.toLowerCase()
        .includes("эскиз"),
  );
});
