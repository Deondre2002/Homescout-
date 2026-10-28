import { useEffect, useState } from "react";
import "./App.css";

const homePhotos = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
];

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProperties() {
      try {
        const API_KEY = import.meta.env.VITE_RENTCAST_API_KEY;

        const res = await fetch(
          "https://api.rentcast.io/v1/listings/rental/long-term?city=Charleston&state=SC&limit=10",
          {
            headers: {
              "X-Api-Key": API_KEY,
              Accept: "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <main className="home-scout">
        <h1>HomeScout 🏡</h1>
        <p className="status-message">Finding your next home...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-scout">
        <h1>HomeScout 🏡</h1>
        <p className="error-message">Unable to load properties: {error}</p>
      </main>
    );
  }

  return (
    <main className="home-scout">
      <header className="page-header">
        <p className="eyebrow">FIND YOUR PLACE</p>
        <h1>Discover your next home.</h1>
        <p className="subtitle">
          Explore rental properties in Charleston, South Carolina.
        </p>
      </header>

      <section className="property-grid">
        {properties.map((property, index) => (
          <article className="property-card" key={property.id}>
            <div className="property-image-container">
              <img
                className="property-image"
                src={homePhotos[index % homePhotos.length]}
                alt="Example home exterior — placeholder photo"
                loading="lazy"
              />
              <span className="photo-label">Example photo</span>
            </div>

            <div className="property-details">
              <p className="property-price">
                {property.price != null
                  ? `$${Number(property.price).toLocaleString()} / month`
                  : "Price unavailable"}
              </p>

              <h2>{property.formattedAddress || "Address unavailable"}</h2>

              <p className="property-location">
                {[property.city, property.state, property.zipCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="property-features">
                <span>
                  <strong>{property.bedrooms ?? "—"}</strong> beds
                </span>
                <span>
                  <strong>{property.bathrooms ?? "—"}</strong> baths
                </span>
                <span>
                  <strong>
                    {property.squareFootage?.toLocaleString() ?? "—"}
                  </strong>{" "}
                  sqft
                </span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {properties.length === 0 && (
        <p className="status-message">No properties were returned.</p>
      )}
    </main>
  );
}

export default App;
