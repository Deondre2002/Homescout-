# 🏡 HomeScout

**A nationwide rental property search application built with React and Vite.**

HomeScout makes it easier to explore rental properties across the United States. Users can search for rental listings by state and city, browse property details, and load additional results.

## 🚀 Features

- **Nationwide Search:** Explore rental listings across all 50 states.
- **Location Filtering:** Search for properties by state and city.
- **Property Listings:** View property information, including address, price, bedrooms, bathrooms, and square footage.
- **Load More:** Retrieve additional property listings through pagination.
- **API Integration:** Fetch real rental listing data using the RentCast API.
- **Responsive Design:** Clean, modern interface with a white and icy-blue color scheme.
- **Loading & Error States:** Provide feedback while fetching property data and when requests fail.

## 🛠️ Technologies Used

- React
- JavaScript
- Vite
- CSS
- RentCast REST API
- Git & GitHub

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Deondre2002/Homescout-.git
```

### 2. Navigate to the project

```bash
cd Homescout-app
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure your API key

Create a `.env` file in the project root:

```env
VITE_RENTCAST_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your RentCast API key.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## 🔑 API

HomeScout uses the [RentCast API](https://www.rentcast.io/api) to retrieve rental property listings.

An API key is required to access the rental listing data.

**Security note:** Vite environment variables prefixed with `VITE_` are exposed in the browser bundle. This setup is intended for local development; a production deployment should route API requests through a secure backend.

## 📌 Project Status

HomeScout is actively under development. New features and improvements are being added as the application evolves.

## 👨‍💻 Developer

**Deondre Johnson**

- GitHub: [@Deondre2002](https://github.com/Deondre2002)

---

_Built with React, JavaScript, and a passion for creating useful applications._
