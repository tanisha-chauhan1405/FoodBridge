# FoodBridge — Frontend App Demo

FoodBridge is a responsive, frontend-only food surplus sharing application built with **HTML, CSS and vanilla JavaScript**. It expands the original landing page into a multi-view app prototype for food donors and NGOs/community organisations.

## Run the project

1. Extract the `foodbridge-app.zip` folder.
2. Open the folder in VS Code.
3. Run `index.html` with the VS Code **Live Server** extension, or open `index.html` directly in a browser.
4. Use one of the one-click demo account buttons on the sign-in page, or create a new account.

The app uses Google Fonts and remote Unsplash image URLs, so an internet connection is needed for those visual assets. The core HTML, CSS and JavaScript are local.

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Food donor | `donor@foodbridge.demo` | `demo123` |
| NGO / community organisation | `ngo@foodbridge.demo` | `demo123` |

You can also use the bakery donor account: `bakery@foodbridge.demo` / `demo123`.

## Included features

- Public landing page with impact, process and food-board preview sections.
- Sign in, sign up, role selection and one-click demo access.
- Separate donor and NGO/community organisation workspaces.
- Dashboard statistics and recent activity.
- Create, browse, search and filter food listings.
- View listing details and request a pickup.
- Donor workflow to accept or decline pickup requests.
- Receiver workflow to mark an approved pickup as collected.
- My listings, My requests, activity timeline, profile editing and notifications.
- Responsive layouts for desktop, tablet and mobile screens.

## Project structure

```text
foodbridge-app/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Important prototype limitation

This version is **frontend-only**. Accounts, listings and requests are stored in the browser's `localStorage`. Passwords are not securely hashed, there is no real server/database, and different users or devices do not share data. Do not use real personal information or treat this demo authentication as production security. A production deployment needs a backend API, secure authentication, database, server-side validation and appropriate privacy/security controls.

## Reset demo data

To reset the app to its original sample data, open the browser developer tools, go to **Application / Storage → Local Storage**, delete the keys beginning with `foodbridge_`, and refresh the page.
