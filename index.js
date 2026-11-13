const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let hostels = [
  { id: 1, name: "Sunrise Hostel Thika", location: "Thika Town", price: 3500, rooms: 20, available: 12 },
  { id: 2, name: "Green View Hostel", location: "Near MKU", price: 4000, rooms: 15, available: 5 },
  { id: 3, name: "Budget Stay", location: "Thika Road", price: 2500, rooms: 30, available: 18 }
];

let bookings = [];

app.get('/', (req, res) => {
  res.json({ message: "Hostel Booking API is working!" });
});

app.get('/api/hostels', (req, res) => {
  res.json(hostels);
});

app.get('/api/hostels/:id', (req, res) => {
  const h = hostels.find(x => x.id == req.params.id);
  if(!h) return res.status(404).json({ error: "Hostel not found" });
  res.json(h);
});

app.post('/api/bookings', (req, res) => {
  const { hostelId, name, phone } = req.body;
  const hostel = hostels.find(x => x.id == hostelId);
  if(!hostel) return res.status(404).json({ error: "Hostel not found" });
  if(hostel.available <= 0) return res.status(400).json({ error: "No rooms available" });
  hostel.available--;
  const booking = { id: bookings.length + 1, hostelId, name, phone, date: new Date() };
  bookings.push(booking);
  res.status(201).json({ message: "Booked successfully!", booking });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
