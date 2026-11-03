import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_RENTCAST_API_KEY;
const PAGE_SIZE = 50;

const states = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
];

const homePhotos = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
];

function App() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("SC");

  const [searchCity, setSearchCity] = useState("");
  const [searchState, setSearchState] = useState("SC");
  const [searchVersion, setSearchVersion] = useState(0);

  const [properties, setProperties] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      setLoading(true);
      setError("");

      if (offset === 0) {
        setProperties([]);
        setHasMore(false);
      }

      try {
        const params = new URLSearchParams({
          state: searchState,
          limit: String(PAGE_SIZE),
          offset: String(offset),
        });

        // An empty city means search the selected state.
        if (searchCity) {
          params.set("city", searchCity);
        }

        const response = await fetch(
          `https://api.rentcast.io/v1/listings/rental/long-term?${params}`,
          {
            headers: {
              "X-Api-Key": API_KEY,
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Unable to load listings (HTTP ${response.status}).`);
        }

        const data = await response.json();

        if (cancelled) return;

        if (!Array.isArray(data)) {
          throw new Error("The API returned an unexpected response.");
        }

        setProperties((current) =>
          offset === 0 ? data : [...current, ...data],
        );

        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Something went wrong.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [searchCity, searchState, offset, searchVersion]);

  function handleSearch(event) {
    event.preventDefault();

    const trimmedCity = city.trim();

    setSearchCity(trimmedCity);
    setSearchState(state);
    setOffset(0);
    setSearchVersion((version) => version + 1);
  }

  function loadMore() {
    if (!loading && hasMore) {
      setOffset((current) => current + PAGE_SIZE);
    }
  }

  const stateName =
    states.find(([code]) => code === searchState)?.[1] || searchState;

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>Find a place to call home.</h1>
        <p className="hero-description">
          Discover rental properties across the United States.
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <label className="search-field">
            <span>City (optional)</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Any city in your state"
            />
          </label>

          <label className="search-field state-field">
            <span>State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              {states.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search homes"}
          </button>
        </form>
      </header>

      <section className="listings-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE RENTALS</p>
            <h2>
              {searchCity
                ? `Homes in ${searchCity}, ${searchState}`
                : `Homes across ${stateName}`}
            </h2>
          </div>

          <span className="listing-count">{properties.length} loaded</span>
        </div>

        {loading && (
          <p className="status-message">Finding available homes...</p>
        )}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="status-message">
            No listings found. Try another city or state.
          </p>
        )}

        <div className="property-grid">
          {properties.map((property, index) => (
            <article
              className="property-card"
              key={property.id ?? `${property.formattedAddress}-${index}`}
            >
              <img
                className="property-image"
                src={homePhotos[index % homePhotos.length]}
                alt="Example home exterior"
                loading="lazy"
              />

              <div className="property-details">
                <p className="property-price">
                  {typeof property.price === "number"
                    ? `${property.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}/mo`
                    : "Price unavailable"}
                </p>

                <h3>{property.formattedAddress || "Address unavailable"}</h3>

                <p className="property-location">
                  {[property.city, property.state, property.zipCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                <div className="property-features">
                  <span>{property.bedrooms ?? "—"} beds</span>
                  <span>{property.bathrooms ?? "—"} baths</span>
                  <span>
                    {property.squareFootage
                      ? `${property.squareFootage.toLocaleString()} sqft`
                      : "Size unavailable"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="load-more-container">
            <button
              className="load-more-button"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Homes"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
