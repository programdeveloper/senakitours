# Senaki Tours — სენაკის ტურისტული გზამკვლევი

A **Frappe application** providing an interactive digital tourist guide for **Senaki Municipality, Georgia**.

## Features

- 🗺️ **Interactive Map** — Leaflet.js map with satellite/street view toggle
- 🏷️ **Category Filters** — Filter by Historical, Cultural, Religious, Nature, Hotels, Restaurants, etc.
- 📍 **Tourist Objects** — Detailed information cards with photos, coordinates, descriptions (Georgian & English)
- 🧭 **Route Planning** — Calculate distance and duration between any two tourist objects
- 🔍 **Search** — Instant search across all tourist objects
- 📱 **QR Codes** — Auto-generated QR codes linking to Google Maps
- 🌐 **Bilingual** — Georgian / English language toggle
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## Installation

```bash
# From your frappe-bench directory
bench get-app https://github.com/your-org/senaki_tours.git
bench --site your-site install-app senaki_tours
bench migrate
```

After installation, seed data (categories + 10 tourist attractions) is automatically created.

## Usage

- **Admin**: Manage tourist objects at `/app/tourist-object`
- **Public Map**: Visit `/tours` to see the interactive tourist map

## DocTypes

| DocType | Purpose |
|---------|---------|
| Tourist Category | Categories with colors and icons for map markers |
| Tourist Object | Tourist attractions with coordinates, descriptions, images |
| Tourist Object Image | Gallery images (child table) |
| Tourist Route | Routes between tourist objects with distance/duration |

## Tech Stack

- **Backend**: Frappe Framework (Python)
- **Frontend**: Leaflet.js, Vanilla JS, CSS3
- **Map Tiles**: OpenStreetMap + Esri Satellite

## License

MIT
