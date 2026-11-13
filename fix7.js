const fs = require('fs');
let serverFile = fs.existsSync("server.js") ? "server.js" : "index.js";
let s = fs.readFileSync(serverFile,"utf8");
// Replace old /bookings with secure pretty version
s = s.replace(/app\.get\('\/bookings'[\s\S]*?\}\);/, `
app.get('/bookings', (req,res)=>{
  if(req.query.pass !== 'telvin123'){
    return res.send('<body style="font-family:sans-serif;display:flex;justify-content:center;padding:40px;background:#f6f6f6"><form style="background:#fff;padding:24px;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.1);width:100%;max-width:320px"><h2>🔒 Owner Only</h2><p>Enter password to see bookings</p><input name="pass" type="password" placeholder="Password" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:10px;box-sizing:border-box"><button style="width:100%;padding:12px;margin-top:10px;background:#111;color:#fff;border:none;border-radius:10px;font-weight:bold">View Bookings</button></form></body>');
  }
  let rows = BOOKINGS.map((b,i)=>'<tr><td>'+(i+1)+'</td><td>'+(b.msg||'')+'</td><td>KSh '+(b.price||'')+'</td><td>'+(b.payment||'')+'</td><td>'+(b.time||'')+'</td></tr>').join('') || '<tr><td colspan=5 style="text-align:center;padding:20px">No bookings yet</td></tr>';
  res.send('<body style="font-family:sans-serif;background:#f6f6f6;padding:16px"><h1>🏠 Thika Hostels - Bookings ('+BOOKINGS.length+')</h1><p>Only you can see this page.</p><table border=1 cellpadding=10 cellspacing=0 style="width:100%;background:#fff;border-collapse:collapse;border-radius:12px;overflow:hidden"><tr style="background:#111;color:#fff"><th>#</th><th>Booking</th><th>Amount</th><th>Payment</th><th>Time</th></tr>'+rows+'</table><br><a href="/bookings?pass=telvin123">Refresh</a></body>');
});
`);
fs.writeFileSync(serverFile, s);
console.log("FIXED7 OK - Bookings locked");
