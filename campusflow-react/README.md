# CampusFlow CMS — React + Vite

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL shown.

## Demo login
- Admin email: `admin@campusflow.com`
- Admin password: `admin123`

Create a normal User account using Sign up. User accounts and sessions are stored in browser Local Storage.

## Build
Run `npm run build`.

## Deploy to Vercel
Import the GitHub repository into Vercel. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.

## Modules
- Admin: original CampusFlow content management dashboard, content operations, filters and dashboard tools.
- User: signup/login and published campus announcements.
- Authentication: browser Local Storage demo authentication.

**Note:** This is a frontend academic demonstration. Local Storage authentication is not production-grade security and data is browser/device-specific.
