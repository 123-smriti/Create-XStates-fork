import React, { useState, useEffect } from "react";
import "./Displaystates.css";

const Displaystates = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [countryError, setCountryError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [cityError, setCityError] = useState(false);

  
  useEffect(() => {
    fetch("https://location-selector.labs.crio.do/countries")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setCountryError(false);
      })
      .catch(() => {
        setCountries([]);
        setCountryError(true);
      });
  }, []);

  
  const handleCountryChange = async (e) => {
    const selected = e.target.value;
    setCountry(selected);

    
    setState("");
    setStates([]);
    setCity("");
    setCities([]);
    setStateError(false);

    if (!selected) return;

    try {
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${selected}/states`
      );

      if (!res.ok) {
        setStates([]);
        setStateError(true); 
        return;
      }

      const data = await res.json();
      setStates(data);
      setStateError(false);
    } catch {
      setStates([]);
      setStateError(true);
    }
  };

  
  const handleStateChange = async (e) => {
    const selected = e.target.value;
    setState(selected);

    setCity("");
    setCities([]);
    setCityError(false);

    if (!selected) return;

    try {
      const res = await fetch(
        `https://location-selector.labs.crio.do/country=${country}/state=${selected}/cities`
      );

      if (!res.ok) {
        setCities([]);
        setCityError(true);
        return;
      }

      const data = await res.json();
      setCities(data);
      setCityError(false);
    } catch {
      setCities([]);
      setCityError(true);
    }
  };

  return (
    <div className="location">
      <div className="dropdown-container">

        {/* COUNTRY */}
        <select className="dropdown" value={country} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {countryError && (
          <p className="error">Failed to load countries</p>
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
          <p className="error">Failed to load states</p>
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

        {cityError && (
          <p className="error">Failed to load cities</p>
        )}
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






