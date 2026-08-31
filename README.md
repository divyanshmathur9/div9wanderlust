# Wanderlust

A full-stack travel-stay marketplace built with Node.js, Express, EJS, MongoDB, Mapbox, and Cloudinary. Wanderlust supports discovery, hosting, reviews, saved stays, and date-based reservations across 50 curated listings.

## Highlights

- Responsive editorial travel interface for desktop and mobile
- Search across titles, descriptions, locations, and countries
- Category filters, price sorting, empty states, and pagination
- Passport-based signup, login, sessions, and role-aware dashboards
- Owner-authorized listing management with Cloudinary image uploads
- Date-based reservations with guest limits, price totals, overlap protection, and cancellation
- Host reservation visibility, guest trip history, saved stays, and reviews
- Mapbox geocoding and interactive listing maps
- Validation, CSRF protection, rate limiting, upload limits, security headers, and health checks
- Idempotent curated-listing import and automated unit tests

## Architecture

```text
routes → middleware → controllers → Mongoose models → MongoDB
                         ↓
                    EJS views
                         ↓
                CSS + browser scripts
```

Core models: `User`, `Listing`, `Review`, and `Booking`.

## Local setup

Requirements: Node.js 20+, npm, MongoDB, Cloudinary, and Mapbox accounts.

```bash
git clone https://github.com/divyanshmathur9/div9wanderlust.git
cd div9wanderlust
npm install
```

Create `.env`:

```env
ATLASDB_URL=<mongodb-connection-string>
SECRET=<long-random-session-secret>
CLOUD_NAME=<cloudinary-cloud-name>
CLOUD_API_KEY=<cloudinary-api-key>
CLOUD_API_SECRET=<cloudinary-api-secret>
MAP_TOKEN=<mapbox-public-token>
NODE_ENV=development
```

Run the app:

```bash
npm start
```

Open `http://localhost:8080/listings`.

## Commands

```bash
npm test          # Run the unit test suite
npm run check     # Run tests and application syntax checks
npm run dev       # Start with Node watch mode
npm run data:import
```

The curated import is idempotent. Before running it, set `IMPORT_OWNER_USERNAME` to an existing Wanderlust account. Existing listings are not overwritten.

## Production

- Set `NODE_ENV=production` and all required environment variables.
- Use a strong `SECRET`; the app refuses to start in production without one.
- `GET /healthz` reports application and database readiness for a hosting health check.
- Payments are intentionally not processed; reservations demonstrate availability and workflow logic.

## Tests

The Node test suite covers query normalization, search filters, sorting, pagination query strings, date parsing, guest/date validation, night calculations, and booking-overlap queries.

## Security note

Wanderlust includes CSRF tokens, request limits on authentication and booking attempts, restricted upload types and sizes, secure cookie defaults, defensive headers, and production-safe error messages. Dependency audits should still be reviewed before every deployment.

## License

ISC
