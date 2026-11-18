# FoodBridge

FoodBridge is a frontend-only surplus food sharing platform for food donors and community organisations.

## Features

- Donor and NGO demo accounts
- Account creation and browser-local sign-in
- Donor food listings with image uploads
- NGO pickup requests
- Donor request approval and collection tracking
- Browser-local profiles, listings and request data
- Responsive dashboards and public food board

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`

## Run

Open `index.html` in a browser or use the VS Code Live Server extension.

No server, database, package installation or build step is required.

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Food Donor | donor@foodbridge.demo | demo123 |
| NGO / Receiver | ngo@foodbridge.demo | demo123 |

## Data Storage

FoodBridge stores its demo users, listings, profiles and pickup requests in the browser's `localStorage`. Demo account passwords are stored only for local demonstration purposes. Clearing browser storage resets the application.
