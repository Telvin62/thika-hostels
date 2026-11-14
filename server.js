const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

let BOOKINGS = [];
let VACANCIES = { "Sunrise": 50, "Green View Hostel": 48, "Budget Stay": 45, "MKU Heights": 47, "Thika Gateway": 46, "Excel Hostel": 44 };
const PRICES = { "Sunrise": 5500, "Green View Hostel": 6000, "Green View": 6000, "Budget Stay": 4500, "MKU Heights": 6500, "Thika Gateway": 5000, "Excel Hostel": 7000, "Excel": 7000 };
try { if(fs.existsSync('vacancies.json')) VACANCIES = JSON.parse(fs.readFileSync('vacancies.json','utf8')); } catch(e){}
try { if(fs.existsSync('bookings.json')) BOOKINGS = JSON.parse(fs.readFileSync('bookings.json','utf8')); } catch(e){}

app.post('/api/book', (req,res)=>{
  let _h = req.body.hostel || req.body.Hostel || '';
  let _rooms = parseInt(req.body.rooms || req.body.Rooms || 1) || 1;
  req.body.price = (PRICES[_h] || 0) * _rooms;
  req.body.amount = req.body.price;
  req.body.time = new Date().toISOString();
  req.body.status = 'PENDING';
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
app.post('/api/confirm', (req,res)=>{
  if(req.query.pass !== 'Telvin62' && req.body.pass !== 'Telvin62') return res.json({error:'wrong password'});
  let idx = req.body.idx;
  if(BOOKINGS[idx]){
    BOOKINGS[idx].status='PAID';
    try{ fs.writeFileSync('bookings.json', JSON.stringify(BOOKINGS)); }catch(e){}
    return res.json({ok:true});
  }
  res.json({error:'not found'});
});
app.get('/api/bookings', (req,res)=>{
  if(req.query.pass !== 'Telvin62') return res.json({error:'Wrong password'});
  res.json({bookings: BOOKINGS, vacancies: VACANCIES});
});
app.post('/api/delete', (req,res)=>{
  if(req.body.pass !== 'Telvin62' && req.query.pass !== 'Telvin62') return res.json({error:'Wrong password'});
  const idx = parseInt(req.body.idx);
  if(isNaN(idx) || !BOOKINGS[idx]) return res.json({error:'Not found'});
  const removed = BOOKINGS.splice(idx,1)[0];
  // restore vacancy for that hostel
  if(removed.hostel && VACANCIES[removed.hostel] !== undefined) VACANCIES[removed.hostel]++;
  try{ fs.writeFileSync('bookings.json', JSON.stringify(BOOKINGS)); }catch(e){}
  try{ fs.writeFileSync('vacancies.json', JSON.stringify(VACANCIES)); }catch(e){}
  res.json({ok:true});
});
app.get('/bookings', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner - Bookings</title><style>body{font-family:sans-serif;background:#f6f6f6;padding:16px} .card{background:#fff;padding:20px;border-radius:16px;max-width:600px;margin:20px auto;box-shadow:0 2px 12px rgba(0,0,0,.1)} input{width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;box-sizing:border-box;margin:10px 0} button{width:100%;padding:12px;background:#111;color:#fff;border:none;border-radius:10px;font-weight:bold} .logout{background:#e11d48} table{width:100%;border-collapse:collapse;background:#fff} th{background:#111;color:#fff;padding:10px} td{padding:10px;border-bottom:1px solid #eee} .top{display:flex;justify-content:space-between;align-items:center}</style></head><body>
  <div id="login" class="card"><h2>🔒 Owner Login</h2><p>Enter password to see bookings</p><input id="pass" type="password" placeholder="Password"><button onclick="doLogin()">Login</button><p id="err" style="color:red"></p></div>
  <div id="main" class="card" style="display:none;max-width:800px"><div class="top"><h2>🏠 Bookings</h2><button onclick="doLogout()" class="logout" style="width:auto;padding:8px 16px">🚪 Logout</button></div><p id="vac"></p><input id="searchBox" placeholder="Search name / phone / hostel..." oninput="doSearch()" style="width:100%;padding:10px;margin:10px 0;font-size:16px;border:1px solid #ccc;border-radius:8px"><div id="list"></div></div>
  <script>
  
let ALL_BOOKINGS = [];
function doSearch(){
  const q = (document.getElementById('searchBox')?.value||'').toLowerCase();
  const filtered = ALL_BOOKINGS.map((b,i)=>{ let c={...b}; c._origIdx=i; return c; }).filter((b) => (b.msg||'').toLowerCase().includes(q) || (b.hostel||'').toLowerCase().includes(q));
  // Re-use showBookings but with filtered list - keep vacancies from last load
  showBookings({bookings: filtered, vacancies: window._lastVac || {}});
}
async function deleteBooking(idx, name){
  if(!confirm('Delete booking: ' + name + '? Vacancy will be restored.')) return;
  const pass = sessionStorage.getItem('pass') || document.getElementById('pass')?.value || 'Telvin62';
  const r = await fetch('/api/delete', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({idx, pass})});
  const d = await r.json();
  if(d.ok){ alert('Deleted'); doLogin(); } else alert(d.error||'Failed');
}
function renderBookings(list){
  // This will be called by patched showBookings - fallback: reload
  if(window._origShowBookings) window._origShowBookings(list);
}

async function doLogin(){
    let p = document.getElementById('pass').value;
    let r = await fetch('/api/bookings?pass='+encodeURIComponent(p)); let d = await r.json();
    if(d.error){ document.getElementById('err').innerText='❌ Wrong password'; return; }
    sessionStorage.setItem('owner','yes'); sessionStorage.setItem('pass',p);
    showBookings(d);
  }
  
async function confirmPay(i){
  let p = sessionStorage.getItem('pass');
  if(!p){ alert('Please login again'); return; }
  try{
    let r = await fetch('/api/confirm?pass='+encodeURIComponent(p),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idx:i,pass:p})});
    let d = await r.json();
    if(d.ok){ alert('Marked PAID ✅'); location.reload(); }
    else alert('Failed: '+(d.error||'Unknown'));
  }catch(e){ alert('Network error: '+e); }
}

function showBookings(d){ ALL_BOOKINGS = d.bookings||[]; window._lastVac = d.vacancies||{};
    document.getElementById('login').style.display='none'; document.getElementById('main').style.display='block';
    document.getElementById('vac').innerText = 'Vacancies: ' + JSON.stringify(d.vacancies||{});
    let rows = (d.bookings||[]).map((b,i)=>'<tr><td>'+(i+1)+'</td><td>'+(b.msg||'')+'</td><td>'+(b.price||'')+'</td><td>'+(b.time||'')+'</td><td>'+(b.status||'PENDING')+'</td><td>'+(b.status==='PAID'?'✅ PAID':'<button onclick=confirmPay('+i+') style=width:auto;padding:6px>Confirm</button>' + '<button onclick="deleteBooking((b._origIdx!==undefined?b._origIdx:i), \''+ (b.msg||'').replace(/'/g,'') + '\')" style="width:auto;padding:6px;background:#dc3545;color:white;border:none;border-radius:6px;margin-left:5px">Delete</button>')+'</td></tr>').join('') || '<tr><td colspan=4 style="text-align:center">No bookings yet</td></tr>';
    document.getElementById('list').innerHTML = '<table><tr><th>#</th><th>Booking</th><th>Amount</th><th>Time</th><th>Status</th><th>Action</th></tr>'+rows+'</table>';
  }
  async function doLogout(){
    sessionStorage.removeItem('owner'); sessionStorage.removeItem('pass');
    document.getElementById('main').style.display='none'; document.getElementById('login').style.display='block';
    document.getElementById('pass').value=''; document.getElementById('err').innerText='Logged out ✅';
  }
  // If already logged in this tab, stay logged in - else show login
  (async ()=>{
    if(sessionStorage.getItem('owner')==='yes'){
      let p = sessionStorage.getItem('pass'); let r = await fetch('/api/bookings?pass='+encodeURIComponent(p)); let d = await r.json(); if(!d.error) showBookings(d);
    }
  })();
  </script><a href="https://wa.me/254769751803?text=Hi! I want to book a hostel in Thika" target="_blank" style="position:fixed;bottom:20px;right:20px;background:#25D366;color:white;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;text-decoration:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);">💬</a></body></html>`);
});

app.listen(PORT, '0.0.0.0', ()=> console.log('Server on ' + PORT));
