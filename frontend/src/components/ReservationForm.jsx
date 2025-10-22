import React, { useState } from "react";
import "../pages/Form.css";


function Reservation({ user, onReserve }) {
  const [name, setName] = useState(user);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onReserve({ name, date, time, guests });
  };

  return (
    <div className="page">
      <div className="form-card">
        <h2 className="title">🍽️ Book Your Table</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="number"
            value={guests}
            min="1"
            max="20"
            onChange={(e) => setGuests(e.target.value)}
          />
          <button type="submit">Confirm Reservation</button>
        </form>
      </div>
    </div>
  );
}

export default Reservation;
