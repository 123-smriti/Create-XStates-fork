import React, { useState, useEffect } from "react";
import "./Displaystates.css";

const Displaystates = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  
  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");

 
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setCountryError("");
      })
      .catch(() => {
        setCountryError("Failed to fetch countries");
        setCountries([]); 
      });
  }, []);

  const handleCountryChange = async (e) => {
    const selected = e.target.value;
    setCountry(selected);
    setState("");
    setCity("");
    setCities([]);
    setStates([]);
    setStateError(""); 

    if (!selected) return;

    try {
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${selected}/states`
      );
      const data = await res.json();
      setStates(data);
      setStateError("");
    } catch (error) {
      setStateError("Failed to fetch states"); 
      setStates([]); 
    }
  };

  const handleStateChange = async (e) => {
    const selected = e.target.value;
    setState(selected);
    setCity("");

    if (!selected) return;

    const res = await fetch(
      `https://location-selector.labs.crio.do/country=${country}/state=${selected}/cities`
    );
    const data = await res.json();
    setCities(data);
  };

  return (
    <div className="location">
      <div className="dropdown-container">
        
        {/* COUNTRY */}
        <select
          className="dropdown"
          value={country}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* COUNTRY ERROR MESSAGE */}
        {countryError && (
          <p data-testid="country-error" style={{ color: "red" }}>
            {countryError}
          </p>
        )}

        {/* STATE */}
        <select
          className="dropdown"
          value={state}
          onChange={handleStateChange}
          disabled={!country}
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        
        {stateError && (
          <p data-testid="state-error" style={{ color: "red" }}>
            {stateError}
          </p>
        )}

        {/* CITY */}
        <select
          className="dropdown"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {country && state && city && (
        <p className="selection-text">
          You selected <strong>{city}</strong>, {state}, {country}
        </p>
      )}
    </div>
  );
};

export default Displaystates;





