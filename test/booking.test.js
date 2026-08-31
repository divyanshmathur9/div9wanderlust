const test = require("node:test");
const assert = require("node:assert/strict");
const { getNights, normalizeBookingInput, overlapFilter, parseDateOnly } = require("../utils/booking");

test("parses date-only values in UTC", () => { assert.equal(parseDateOnly("2030-04-12").toISOString(), "2030-04-12T00:00:00.000Z"); assert.equal(parseDateOnly("12/04/2030"), null); });
test("calculates nights between dates", () => assert.equal(getNights(new Date("2030-04-12Z"), new Date("2030-04-15Z")), 3));
test("validates guest count and date ordering", () => { assert.match(normalizeBookingInput({ checkIn: "2030-04-15", checkOut: "2030-04-12", guests: "2" }, 4).error, /after/); assert.match(normalizeBookingInput({ checkIn: "2030-04-12", checkOut: "2030-04-15", guests: "8" }, 4).error, /between/); });
test("creates a strict overlap query", () => { const filter = overlapFilter("listing-id", new Date("2030-04-12Z"), new Date("2030-04-15Z")); assert.equal(filter.status, "confirmed"); assert.equal(filter.checkIn.$lt.toISOString(), "2030-04-15T00:00:00.000Z"); });
