# Code Society — Ticket Atelier

A luxury burgundy boarding-pass style ticket generator for Code Society.

## Features
- Personalise first name, surname and tagline.
- Live ticket preview with a unique ticket ID.
- CODE128 barcode generated from the ticket ID.
- Export the ticket artwork only as high-resolution PNG or PDF.
- Responsive layout; no backend or paid service required.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

The app uses React + Vite, html-to-image, jsPDF and JsBarcode. Ticket issuance is client-side in this first version; IDs are unique per generated ticket but are not stored in a central attendee database.
