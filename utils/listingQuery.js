const CATEGORIES = [
  { slug: "trending", label: "Trending", icon: "fa-fire", pattern: "villa|island|penthouse|retreat" },
  { slug: "beach", label: "Beach", icon: "fa-umbrella-beach", pattern: "beach|island|bali|maldives|phuket|coast" },
  { slug: "mountains", label: "Mountains", icon: "fa-mountain-sun", pattern: "mountain|cabin|chalet|ski|aspen|banff|montana" },
  { slug: "cities", label: "City breaks", icon: "fa-city", pattern: "city|apartment|loft|penthouse|tokyo|boston|dubai|miami" },
  { slug: "unique", label: "Unique homes", icon: "fa-house-chimney-window", pattern: "treehouse|castle|dome|houseboat|historic" },
];

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeQuery = (query = {}) => ({
  q: typeof query.q === "string" ? query.q.trim().slice(0, 80) : "",
  category: CATEGORIES.some(({ slug }) => slug === query.category) ? query.category : "",
  sort: ["newest", "price-asc", "price-desc"].includes(query.sort) ? query.sort : "newest",
  page: Math.max(1, Number.parseInt(query.page, 10) || 1),
});

const buildListingFilter = ({ q, category }) => {
  const clauses = [];

  if (q) {
    const search = new RegExp(escapeRegex(q), "i");
    clauses.push({ $or: ["title", "description", "location", "country"].map((field) => ({ [field]: search })) });
  }

  if (category) {
    const config = CATEGORIES.find(({ slug }) => slug === category);
    clauses.push({
      $or: [
        { category },
        { title: new RegExp(config.pattern, "i") },
        { description: new RegExp(config.pattern, "i") },
      ],
    });
  }

  return clauses.length ? { $and: clauses } : {};
};

const getSort = (sort) => {
  if (sort === "price-asc") return { price: 1, _id: -1 };
  if (sort === "price-desc") return { price: -1, _id: -1 };
  return { _id: -1 };
};

const buildQueryString = (query, overrides = {}) => {
  const params = new URLSearchParams({ ...query, ...overrides });
  for (const [key, value] of [...params.entries()]) {
    if (!value || (key === "page" && value === "1")) params.delete(key);
  }
  const value = params.toString();
  return value ? `?${value}` : "";
};

module.exports = { CATEGORIES, buildListingFilter, buildQueryString, escapeRegex, getSort, normalizeQuery };
