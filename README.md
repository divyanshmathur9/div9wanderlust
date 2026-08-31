# Wanderlust

### A full-stack marketplace for discovering, hosting, and reserving memorable stays

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?logo=render&logoColor=black)](https://render.com/)

[**Explore the live application**](https://wanderlust-project-wges.onrender.com/listings) · [Report an issue](https://github.com/divyanshmathur9/div9wanderlust/issues)

Wanderlust is an Airbnb-inspired travel platform built with Node.js, Express, EJS, and MongoDB. It combines an editorial discovery experience with authentication, host tools, saved stays, reviews, interactive maps, and a complete reservation workflow across 50 curated properties.

> The live application uses Render's free tier, so its first request after inactivity may take up to a minute.

## What you can do

### Discover

- Browse a responsive collection of 50 curated stays
- Search by title, description, destination, or country
- Filter by trending, beach, mountain, city, and unique-home categories
- Sort by newest listing or price and navigate paginated results
- View property details, amenities, guest capacity, location, and pricing
- Explore interactive Mapbox maps and save favorite stays

### Book

- Select check-in and check-out dates
- See the calculated number of nights and total price
- Enforce guest limits and reject invalid date ranges
- Prevent overlapping reservations for the same property
- Review upcoming and past trips from a traveler dashboard
- Cancel confirmed reservations

### Host

- Create, edit, and remove owned listings
- Upload listing media through Cloudinary
- Geocode destinations through Mapbox
- See incoming reservations for owned properties
- Keep guest and host actions separated through authorization checks

### Trust and reliability

- Passport-based signup, login, logout, and persistent sessions
- Password hashing and secure production cookie settings
- CSRF protection for state-changing forms
- Rate limiting for authentication and reservation attempts
- Request validation, restricted uploads, security headers, and safe production errors
- Database-aware health checks and automated tests

## Technology

| Layer | Tools |
| --- | --- |
| Server | Node.js, Express.js |
| Views | EJS, EJS Mate |
| Database | MongoDB Atlas, Mongoose |
| Authentication | Passport.js, passport-local-mongoose, express-session |
| Media | Cloudinary, Multer |
| Maps | Mapbox Geocoding and Maps |
| Validation and security | Joi, Helmet, CSRF tokens, rate limiting |
| Testing | Node.js test runner |
| Deployment | Render |

## Architecture

```text
Browser
  │
  ▼
Express routes ──► middleware ──► controllers ──► Mongoose models ──► MongoDB
                                      │
                                      ▼
                                  EJS views
                                      │
                                      ▼
                              CSS + browser scripts
```

The core domain models are:

- `User` — authentication, roles, favorites, and account ownership
- `Listing` — property information, media, location, capacity, and amenities
- `Booking` — dates, guests, nightly price, total price, and reservation status
- `Review` — guest ratings and comments associated with listings

## Project structure

```text
div9wanderlust/
├── controllers/       # Request handlers and application workflows
├── init/              # Curated listing data and import utilities
├── middleware/        # Authentication, authorization, validation, and CSRF
├── models/            # Mongoose schemas
├── public/            # Stylesheets and browser-side scripts
├── routes/            # Express route definitions
├── tests/             # Automated unit tests
├── utils/             # Query, booking, error, and helper utilities
├── views/             # EJS layouts and pages
├── app.js             # Application entry point
└── schema.js          # Joi request schemas
```

## Run locally

### Prerequisites

- Node.js 20+
- npm
- A local MongoDB server or MongoDB Atlas cluster
- Mapbox account
- Cloudinary account for image uploads

### Installation

```bash
git clone https://github.com/divyanshmathur9/div9wanderlust.git
cd div9wanderlust
npm install
```

Create a `.env` file in the project root:

```env
ATLASDB_URL=mongodb://127.0.0.1:27017/wanderlust
SECRET=replace-with-a-long-random-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
MAP_TOKEN=your-mapbox-public-token
NODE_ENV=development
```

Never commit `.env` or real credentials to source control.

Start the application:

```bash
npm start
```

Then open [http://localhost:8080/listings](http://localhost:8080/listings).

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the application |
| `npm run dev` | Start in Node watch mode |
| `npm test` | Run the unit test suite |
| `npm run check` | Run tests and syntax checks |
| `npm run data:import` | Import curated stays without overwriting existing ones |

The curated import is idempotent. Set `IMPORT_OWNER_USERNAME` to an existing Wanderlust username before importing; records that already exist are left unchanged.

## Main routes

| Route | Description |
| --- | --- |
| `GET /listings` | Search, filter, sort, and browse stays |
| `GET /listings/:id` | View a stay, reviews, map, and reservation options |
| `POST /listings` | Create a host listing |
| `POST /listings/:id/bookings` | Reserve available dates |
| `GET /dashboard` | View saved stays, trips, listings, and host reservations |
| `GET /healthz` | Report application and database readiness |

Protected and state-changing routes additionally enforce authentication, authorization, validation, and CSRF checks where applicable.

## Testing

```bash
npm test
```

The test suite covers:

- Search and category filter construction
- Query normalization, sorting, and pagination links
- Date parsing and night calculations
- Guest and reservation input validation
- Booking-overlap detection

## Deployment

The production application runs on Render with MongoDB Atlas. Production setup requires:

- All environment variables configured in the hosting dashboard
- A strong, randomly generated session secret
- Render's outbound IP ranges allowed by Atlas network access
- `NODE_ENV=production`
- `/healthz` configured as the service health-check path

The reservation flow is a portfolio demonstration: it intentionally does not collect or process payment information.

## Engineering highlights

- Built an end-to-end marketplace rather than a static clone
- Designed separate traveler and host workflows with ownership-based authorization
- Modeled availability and prevented conflicting reservations at the application layer
- Added production security controls, health reporting, validation, and graceful errors
- Implemented reusable query utilities for discovery, sorting, filtering, and pagination
- Created a safe, repeatable data-import process for curated inventory

## Future improvements

- Transactional payment integration
- Email confirmations and reservation reminders
- Availability calendar management for hosts
- Automated browser-level integration tests
- Image optimization and CDN transformations
- Structured application monitoring and alerting

## License

This project is licensed under the ISC License.
