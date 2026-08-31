const test = require("node:test");
const assert = require("node:assert/strict");
const { buildListingFilter, buildQueryString, escapeRegex, getSort, normalizeQuery } = require("../utils/listingQuery");

test("normalizes unsafe and unsupported query values", () => {
  assert.deepEqual(normalizeQuery({ q: "  Goa  ", category: "unknown", sort: "random", page: "-4" }), {
    q: "Goa",
    category: "",
    sort: "newest",
    page: 1,
  });
});

test("escapes regular-expression control characters", () => {
  assert.equal(escapeRegex("villa (sea)+"), "villa \\(sea\\)\\+");
});

test("builds combined search and category filters", () => {
  const filter = buildListingFilter({ q: "Goa", category: "beach" });
  assert.equal(filter.$and.length, 2);
  assert.equal(filter.$and[0].$or.length, 4);
  assert.equal(filter.$and[1].$or[0].category, "beach");
});

test("maps supported sort values", () => {
  assert.deepEqual(getSort("price-asc"), { price: 1, _id: -1 });
  assert.deepEqual(getSort("price-desc"), { price: -1, _id: -1 });
  assert.deepEqual(getSort("newest"), { _id: -1 });
});

test("builds clean pagination query strings", () => {
  assert.equal(buildQueryString({ q: "Goa", category: "beach", sort: "newest", page: 1 }), "?q=Goa&category=beach&sort=newest");
});
