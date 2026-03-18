import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodFilter, setBloodFilter] = useState("all");
  const [citySearch, setCitySearch] = useState("");
  const [requests, setRequests] = useState({});
  const [showAvailable, setShowAvailable] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore"];

  // Fetch data (useEffect)
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(user => ({
          id: user.id,
          name: user.name,
          city: cities[Math.floor(Math.random() * cities.length)],
          blood: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
          available: Math.random() > 0.3
        }));

        setDonors(mapped);
        setLoading(false);
      });
  }, []);

  // Request button
  const handleRequest = (id) => {
    setRequests(prev => ({ ...prev, [id]: true }));
  };

  // Filtering logic
  const filteredDonors = donors.filter(donor => {
    const matchBlood =
      bloodFilter === "all" || donor.blood === bloodFilter;

    const matchCity =
      donor.city.toLowerCase().includes(citySearch.toLowerCase());

    const matchAvailability =
      !showAvailable || donor.available;

    return matchBlood && matchCity && matchAvailability;
  });

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <h1>🩸 Blood Donor Finder</h1>

      {/* Controls */}
      <div className="controls">
        <select onChange={(e) => setBloodFilter(e.target.value)}>
          <option value="all">All Blood Groups</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by city"
          onChange={(e) => setCitySearch(e.target.value)}
        />

        {/* Show Available Toggle */}
        <label>
          <input
            type="checkbox"
            onChange={() => setShowAvailable(!showAvailable)}
          />
          Show Available Only
        </label>

        {/* Dark Mode Toggle */}
        <label>
          <input
            type="checkbox"
            onChange={() => setDarkMode(!darkMode)}
          />
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </label>
      </div>

      {/* Count */}
      <h3>Total Donors: {filteredDonors.length}</h3>

      {/* Loading */}
      {loading && <p>Loading donors...</p>}

      {/* No Data */}
      {!loading && filteredDonors.length === 0 && (
        <p>No donors found</p>
      )}

      {/* Cards */}
      <div className="container">
        {filteredDonors.map(donor => (
          <div key={donor.id} className="card">
            <h3>🧑 {donor.name}</h3>
            <p>🩸 Blood Group: {donor.blood}</p>
            <p>📍 City: {donor.city}</p>

            <p className={donor.available ? "green" : "red"}>
              {donor.available ? "Available" : "Not Available"}
            </p>

            <button
              className={requests[donor.id] ? "sent" : ""}
              onClick={() => handleRequest(donor.id)}
              disabled={requests[donor.id]}
            >
              {requests[donor.id]
                ? "Request Sent ✅"
                : "Request Help"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;