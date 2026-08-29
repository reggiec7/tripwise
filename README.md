# TripWise

A personal trip tracker: keep every flight, hotel, and activity for a vacation in one
day-by-day timeline.

- **Trips** — destination, dates, travelers, budget; cards sorted active → upcoming → past
  with a countdown to departure.
- **Bookings** — flights (airline, flight #, route, seat), hotels (address, room type),
  and activities (location, category). Each has a confirmation number, cost, status
  (confirmed / pending / cancelled), and notes.
- **Timeline** — bookings grouped by day and sorted by time, filterable by type.
- **Money** — booked total vs. budget, plus counts per booking type.
- **Data** — stored in the browser via `localStorage`; export/import as JSON to move
  between devices or keep a backup.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # type-checks with tsc, then bundles to dist/
```

Static output — `dist/` can be hosted anywhere (GitHub Pages, Netlify, etc.).
