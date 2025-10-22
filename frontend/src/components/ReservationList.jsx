import { useEffect, useState } from "react";
import axios from "axios";

function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get("/api/reservations")
      .then(res => setReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r._id}>
            {r.name} - {r.date} at {r.time} ({r.guests} guests)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationList;
