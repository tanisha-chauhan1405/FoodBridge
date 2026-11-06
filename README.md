# FoodBridge – Rescuing Surplus Food, Feeding Communities

**FoodBridge** is a frontend-based food donation and surplus food management platform designed to connect food donors, such as restaurants and event organizers, with NGOs and organizations that can distribute food to people in need.

The platform aims to reduce food wastage by making surplus food easier to share, discover, and collect.

---

## Project Overview

FoodBridge provides a digital platform where food donors can list their surplus food and NGOs can browse available donations and request pickups.

It provides separate dashboards for donors and NGOs, allowing both user roles to manage their activities through a simple and user-friendly interface.

## Features

### 1. User Authentication
- Login and Sign Up interfaces.
- Separate user roles for Food Donors and NGOs/Receivers.
- Demo accounts for exploring the application.
- Profile management.

### 2. Food Donor Dashboard
- Overview of donation activities.
- Post surplus food listings.
- Upload actual food photographs from a device.
- Preview images before publishing.
- Manage and update food listings.
- View incoming pickup requests.
- Accept or reject NGO requests.
- View NGO contact information.

### 3. NGO / Receiver Dashboard
- Browse available food donations.
- Explore food listings.
- View food details, quantity, servings and pickup information.
- Send food pickup requests.
- Track request status.
- View donor contact information.

### 4. Food Image Upload
- Upload food images directly from a computer or mobile device.
- Image preview before publishing.
- Image compression to reduce storage usage.
- Support for JPG, PNG and WebP images.

### 5. Donor–NGO Communication
- Display contact information within relevant pickup requests.
- Clickable phone numbers using `tel:` links.
- Clickable email addresses using `mailto:` links.
- Contact details are available to the involved parties in their request sections.

### 6. Dashboard & User Experience
- Separate dashboards for different user roles.
- Activity statistics and donation summaries.
- Food listing cards.
- Search and filtering functionality.
- Responsive layout for different screen sizes.
- Notifications and request status indicators.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application functionality and interactivity |
| localStorage | Browser-based data storage |
| Git & GitHub | Version control and project hosting |

---

## Project Structure

FoodBridge/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│   ├── hero-food-donation.jpg
│   ├── vegetable-biryani.jpg
│   ├── bread-pastries.jpg
│   └── other food images...
│
└── README.md
```

---

## 🚀 How to Run the Project

Follow these steps to run FoodBridge locally:

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/FoodBridge.git
```

**2. Open the project folder**

```bash
cd FoodBridge
```

**3. Open the project in Visual Studio Code**

```bash
code .
```

**4. Run the application**

- Install the Live Server extension in VS Code.
- Open `index.html`.
- Right-click and select **Open with Live Server**.

The application will open in your browser.

---

## Demo Login Credentials

Use the following demo accounts to explore the application.

| User Role | Email | Password |
|---|---|---|
| Food Donor | donor@foodbridge.demo | demo123 |
| NGO / Receiver | ngo@foodbridge.demo | demo123 |

The application also provides demo login options through its interface.

---

## Data Storage

FoodBridge currently uses browser `localStorage` to store application data, including:

- User information
- Food donation listings
- Pickup requests
- Request statuses
- Uploaded food images

Since the project is currently frontend-only, data is stored locally in the browser.

**Note:** This is a frontend prototype. It does not currently use a backend server or a cloud database. Data is not automatically synchronized between different devices or browsers.

---

## Future Improvements

The following improvements are planned for future versions:

- MongoDB or another database integration.
- Backend development using Node.js and Express.js.
- Secure authentication and authorization.
- Real-time notifications for pickup requests.
- Cloud-based image storage.
- Location-based food discovery.
- Verified donor and NGO accounts.
- Deployment as a fully functional web application.

---

## Project Objective

The main objective of FoodBridge is to create a connection between food donors and organizations working to feed communities.

Instead of allowing surplus food to go to waste, the platform encourages responsible food sharing and helps make food donation more accessible.

**Less Waste. More Meals. Stronger Communities.**

---

## Developed By

**Tanisha Chauhan**

MCA Student | KIET Group of Institutions

---

*FoodBridge – Turning surplus into support, one meal at a time.*