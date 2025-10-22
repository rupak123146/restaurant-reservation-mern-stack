import React, { useState } from 'react';

export default function BookingTester() {
  const [form, setForm] = useState({ userEmail: '', name: '', partySize: 2, date: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);
  const [list, setList] = useState([]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'partySize' ? Number(value) : value }));
  };

  const createBooking = async () => {
    setLoading(true); setError(null); setCreated(null);
    try {
      if (!form.userEmail || !form.name || !form.partySize || !form.date) {
        throw new Error('userEmail, name, partySize, date are required');
      }
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCreated(data);
    } catch (e) {
      setError(e.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true); setError(null);
    try {
      const q = form.userEmail ? `?email=${encodeURIComponent(form.userEmail)}` : '';
      const res = await fetch(`/api/bookings${q}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setList(data);
    } catch (e) {
      setError(e.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  };

  const seedBooking = async () => {
    setLoading(true); setError(null); setCreated(null);
    try {
      const res = await fetch('/api/bookings/seed');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCreated(data);
    } catch (e) {
      setError(e.message || 'Seed failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ background: '#fff8e1', border: '1px solid #f0d98c', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Booking Tester</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        <label>
          <div style={{ fontSize: 12, color: '#555' }}>User Email</div>
          <input name="userEmail" value={form.userEmail} onChange={onChange} placeholder="test@example.com" style={{ width: '100%' }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: '#555' }}>Name</div>
          <input name="name" value={form.name} onChange={onChange} placeholder="Test User" style={{ width: '100%' }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: '#555' }}>Party Size</div>
          <input name="partySize" type="number" min={1} value={form.partySize} onChange={onChange} style={{ width: '100%' }} />
        </label>
        <label>
          <div style={{ fontSize: 12, color: '#555' }}>Date/Time (ISO)</div>
          <input name="date" type="datetime-local" value={form.date} onChange={onChange} style={{ width: '100%' }} />
        </label>
        <label style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 12, color: '#555' }}>Notes</div>
          <input name="notes" value={form.notes} onChange={onChange} placeholder="Optional" style={{ width: '100%' }} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <button onClick={createBooking} disabled={loading} style={{ padding: '6px 12px' }}>
          {loading ? 'Saving...' : 'Create Booking'}
        </button>
        <button onClick={loadBookings} disabled={loading} style={{ padding: '6px 12px' }}>
          {loading ? 'Loading...' : 'Load Bookings'}
        </button>
        <button onClick={seedBooking} disabled={loading} style={{ padding: '6px 12px' }}>
          {loading ? 'Seeding...' : 'Seed Sample Booking'}
        </button>
      </div>

      {error && <div style={{ color: '#d73a49', marginTop: 8 }}>Error: {error}</div>}
      {created && <div style={{ marginTop: 8 }}><strong>Created:</strong> <code>{JSON.stringify(created)}</code></div>}
      {list?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <strong>Bookings ({list.length}):</strong>
          <ul>
            {list.map((b) => (
              <li key={b._id}>
                {b.userEmail} | {b.name} | {b.partySize} | {new Date(b.date).toLocaleString()} | {b.notes}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!created && (!list || list.length === 0) && !error && (
        <div style={{ color: '#586069', marginTop: 8 }}>Use the buttons above to create or load bookings.</div>
      )}
    </section>
  );
}
