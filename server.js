const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

let hostels = [
  {id:1, name:"Sunrise Hostel Thika", location:"Thika Town", price:3500, rooms:20, available:11, image:"🌅"},
  {id:2, name:"Green View Hostel", location:"Near MKU", price:4000, rooms:15, available:5, image:"🌿"},
  {id:3, name:"Budget Stay", location:"Thika Road", price:2500, rooms:30, available:18, image:"💰"},
  {id:4, name:"MKU Heights", location:"Opposite MKU Gate", price:4500, rooms:25, available:20, image:"🏫"},
  {id:5, name:"Thika Gateway", location:"Near Thika Stadium", price:3000, rooms:40, available:32, image:"🏟️"},
  {id:6, name:"Excel Hostel", location:"Section 9, Thika", price:5000, rooms:12, available:8, image:"⭐"}
];
let bookings = [{id:1, hostelId:1, name:"Asher Abel", phone:"0769751803", date:"2026-11-13"}];

app.get('/', (req,res)=>res.json({message:"Hostel Booking API is working!"}));
app.get('/api/hostels', (req,res)=>res.json(hostels));
app.get('/api/bookings', (req,res)=>res.json(bookings));

app.post('/api/bookings', (req,res)=>{
  const {hostelId, name, phone} = req.body;
  const hostel = hostels.find(h=>h.id==hostelId);
  if(!hostel) return res.json({message:"Hostel not found"});
  if(hostel.available<=0) return res.json({message:"No rooms left"});
  hostel.available--;
  const booking = {id:bookings.length+1, hostelId, name, phone, date:new Date()};
  bookings.push(booking);
  res.json({message:"Booked successfully!", booking, hostel});
});

app.post('/api/payments', (req,res)=>{
  const {bookingId, phone, amount} = req.body;
  res.json({message:"M-Pesa STK Push Sent!", checkoutId:"WS_CO_"+Date.now(), bookingId, phone, amount, status:"SUCCESS - Payment Received"});
});

app.listen(5000, ()=>console.log('Server running on port 5000'));
