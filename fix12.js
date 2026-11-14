const fs = require('fs');
let s = fs.readFileSync("server.js","utf8");
// Replace the whole /bookings page with OLD look + Logout
s = s.replace(/app\.get\('\/bookings'[\s\S]*?\}\);/, `app.get('/bookings', (req,res)=>{
  res.send(\`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thika Hostels - Bookings</title><style>body{font-family:sans-serif;background:#fff;padding:10px;margin:0} h1{font-size:20px;margin:5px 0} .login{max-width:320px;margin:60px auto;background:#fff;padding:24px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.1)} input{width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;box-sizing:border-box;margin:10px 0} button{width:100%;padding:12px;background:#111;color:#fff;border:none;border-radius:10px;font-weight:bold} .top{display:flex;justify-content:space-between;align-items:center} .logout{width:auto;background:#e11d48;padding:8px 16px} table{width:100%;border-collapse:collapse;background:#fff} th{background:#111;color:#fff;padding:10px;text-align:left} td{padding:10px;border-bottom:1px solid #eee;border:1px solid #ddd}</style></head><body>
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
  </script></body></html>\`);
});`);
fs.writeFileSync("server.js", s);
console.log("FIX12 DONE - Old look back + Logout");
