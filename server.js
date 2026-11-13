const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

let BOOKINGS = [];
let VACANCIES = { "Sunrise": 9, "Green View": 9, "Sunset": 8, "Riverside": 12 };
try { if(fs.existsSync('vacancies.json')) VACANCIES = JSON.parse(fs.readFileSync('vacancies.json','utf8')); } catch(e){}
try { if(fs.existsSync('bookings.json')) BOOKINGS = JSON.parse(fs.readFileSync('bookings.json','utf8')); } catch(e){}

app.post('/api/book', (req,res)=>{
  BOOKINGS.push(req.body);
  // Try to find hostel name in booking message and reduce vacancy
  let h = (req.body.hostel||'').toLowerCase();
   for(let k in VACANCIES){ if(h.includes(k.toLowerCase())){ if(VACANCIES[k]>0) VACANCIES[k]--; } }
   try { fs.writeFileSync('vacancies.json', JSON.stringify(VACANCIES)); } catch(e){}
  try { fs.writeFileSync('bookings.json', JSON.stringify(BOOKINGS)); } catch(e){}
  console.log('🔔 NEW BOOKING:', req.body.msg);
  res.json({ok:true});
});

app.get('/api/vacancies', (req,res)=> res.json(VACANCIES));
app.get('/bookings', (req,res)=>{
  if(req.query.pass !== 'telvin123'){
    return res.send('<body style="font-family:sans-serif;display:flex;justify-content:center;padding:40px;background:#f6f6f6"><form style="background:#fff;padding:24px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.1);width:100%;max-width:320px"><h2>🔒 Owner Only</h2><p>Enter password to see bookings</p><input name="pass" type="password" placeholder="Password" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;box-sizing:border-box"><button style="width:100%;padding:12px;margin-top:10px;background:#111;color:#fff;border:none;border-radius:10px;font-weight:bold">View Bookings</button></form></body>');
  }
  let rows = BOOKINGS.map((b,i)=>'<tr><td>'+(i+1)+'</td><td>'+(b.msg||'')+'</td><td>KSh '+(b.price||'')+'</td><td>'+(b.payment||'')+'</td><td>'+(b.time||'')+'</td></tr>').join('') || '<tr><td colspan=5 style="text-align:center;padding:20px">No bookings yet - try a test booking first</td></tr>';
  res.send('<body style="font-family:sans-serif;background:#f6f6f6;padding:16px"><h1>🏠 Thika Hostels - Bookings ('+BOOKINGS.length+')<br><small>Vacancies: '+JSON.stringify(VACANCIES)+'</small></h1><table border=1 cellpadding=10 cellspacing=0 style="width:100%;background:#fff;border-collapse:collapse"><tr style="background:#111;color:#fff"><th>#</th><th>Booking</th><th>Amount</th><th>Payment</th><th>Time</th></tr>'+rows+'</table></body>');
});

app.listen(PORT, ()=> console.log('Server on ' + PORT));
