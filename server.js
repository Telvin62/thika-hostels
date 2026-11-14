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
app.get('/api/bookings', (req,res)=>{ if(req.query.pass !== 'telvin123') return res.json({error:'wrong password'}); res.json({bookings: BOOKINGS, vacancies: VACANCIES}); });
app.get('/bookings', (req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thika Hostels - Bookings</title><style>body{font-family:sans-serif;background:#fff;padding:10px;margin:0} h1{font-size:20px;margin:5px 0} .login{max-width:320px;margin:60px auto;background:#fff;padding:24px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.1)} input{width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;box-sizing:border-box;margin:10px 0} button{width:100%;padding:12px;background:#111;color:#fff;border:none;border-radius:10px;font-weight:bold} .top{display:flex;justify-content:space-between;align-items:center} .logout{width:auto;background:#e11d48;padding:8px 16px} table{width:100%;border-collapse:collapse;background:#fff} th{background:#111;color:#fff;padding:10px;text-align:left} td{padding:10px;border-bottom:1px solid #eee;border:1px solid #ddd}</style></head><body>
  <div id="login" class="login"><h2>🔒 Owner Only</h2><p>Enter password to see bookings</p><input id="pass" type="password" placeholder="Password"><button onclick="doLogin()">View Bookings</button><p id="err" style="color:red"></p></div>
  <div id="main" style="display:none"><div class="top"><h1>🏠 Thika Hostels - Bookings (<span id="count">0</span>)</h1><button onclick="doLogout()" class="logout">🚪 Logout</button></div><p><b>Vacancies:</b> <span id="vac"></span></p><table><tr><th>#</th><th>Booking</th><th>Amount</th><th>Payment</th><th>Time</th></tr><tbody id="rows"></tbody></table></div>
  <script>
  async function doLogin(){
    let p=document.getElementById('pass').value;
    let r=await fetch('/api/bookings?pass='+encodeURIComponent(p)); let d=await r.json();
    if(d.error){ document.getElementById('err').innerText='❌ Wrong password'; return; }
    sessionStorage.setItem('owner','yes'); sessionStorage.setItem('pass',p); show(d);
  }
  function show(d){
    document.getElementById('login').style.display='none'; document.getElementById('main').style.display='block';
    document.getElementById('count').innerText=(d.bookings||[]).length;
    document.getElementById('vac').innerText=JSON.stringify(d.vacancies||{});
    document.getElementById('rows').innerHTML=(d.bookings||[]).map((b,i)=>'<tr><td>'+(i+1)+'</td><td>'+(b.msg||'')+'</td><td>KSh '+(b.price||'')+'</td><td>'+(b.payment||'M-Pesa')+'</td><td>'+(b.time||'')+'</td></tr>').join('') || '<tr><td colspan=5 style="text-align:center">No bookings yet</td></tr>';
  }
  function doLogout(){ sessionStorage.removeItem('owner'); sessionStorage.removeItem('pass'); document.getElementById('main').style.display='none'; document.getElementById('login').style.display='block'; document.getElementById('pass').value=''; document.getElementById('err').innerText='Logged out ✅'; }
  (async()=>{ if(sessionStorage.getItem('owner')==='yes'){ let p=sessionStorage.getItem('pass'); let r=await fetch('/api/bookings?pass='+encodeURIComponent(p)); let d=await r.json(); if(!d.error) show(d); } })();
  </script></body></html>`);
});
    let rows = (d.bookings||[]).map((b,i)=>'<tr><td>'+(i+1)+'</td><td>'+(b.msg||'')+'</td><td>'+(b.price||'')+'</td><td>'+(b.time||'')+'</td></tr>').join('') || '<tr><td colspan=4 style="text-align:center">No bookings yet</td></tr>';
    document.getElementById('list').innerHTML = '<table><tr><th>#</th><th>Booking</th><th>Amount</th><th>Time</th></tr>'+rows+'</table>';
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
  </script></body></html>`);
});

app.listen(PORT, ()=> console.log('Server on ' + PORT));
