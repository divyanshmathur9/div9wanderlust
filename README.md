# Wanderlust
Wanderlust is a full-stack travel listing web app inspired by Airbnb-style workflows. Users can sign up, create listings, upload photos, browse places, and leave reviews.

## Features
- User authentication (signup, login, logout) with Passport.js
- Create, read, update, and delete listings
- Review and rating system for listings
- Image uploads to Cloudinary using Multer
- Geocoding + map integration using Mapbox
- Flash messages and persistent sessions with MongoDB store

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- EJS + EJS-Mate templating
- Passport Local Authentication
- Cloudinary (media storage)
- Mapbox SDK (geocoding/maps)
- Bootstrap 5 (UI)

## Prerequisites
- Node.js `v20.16.0`
- npm
- MongoDB Atlas database URL
- Cloudinary account
- Mapbox access token

## Environment Variables
Create a `.env` file in the project root with:

```env
ATLASDB_URL=<your_mongodb_connection_string>
SECRET=<your_session_secret>
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>
MAP_TOKEN=<your_mapbox_access_token>
NODE_ENV=development
```

## Run Locally
```bash
npm install
npm start
```

App runs at: `http://localhost:8080`

For auto-restart during development:
```bash
npm run dev
```

