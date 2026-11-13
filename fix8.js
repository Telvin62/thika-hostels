const fs = require('fs');
// --- 1. SERVER: Add vacancies + save bookings ---
let s = fs.readFileSync("server.js","utf8");
if(!s.includes("/api/vacancies")){
  s = s.replace("let BOOKINGS = [];", `let BOOKINGS = [];
let VACANCIES = { "Sunrise": 10, "Sunset": 8, "Riverside": 12, "Green View": 10 };
try { if(fs.existsSync('vacancies.json')) VACANCIES = JSON.parse(fs.readFileSync('vacancies.json','utf8')); } catch(e){}`);
  s = s.replace("BOOKINGS.push(req.body);", `BOOKINGS.push(req.body);
  // Try to find hostel name in booking message and reduce vacancy
  for(let k in VACANCIES){ if((req.body.msg||'').toLowerCase().includes(k.toLowerCase())){ if(VACANCIES[k]>0) VACANCIES[k]--; } }
  try { fs.writeFileSync('vacancies.json', JSON.stringify(VACANCIES)); } catch(e){}`);
  s = s.replace("app.get('/bookings'", `app.get('/api/vacancies', (req,res)=> res.json(VACANCIES));
app.get('/bookings'`);
  // Show vacancies on bookings page too
  s = s.replace("Thika Hostels - Bookings ('+BOOKINGS.length+')", "Thika Hostels - Bookings ('+BOOKINGS.length+')<br><small>Vacancies: '+JSON.stringify(VACANCIES)+'</small>");
  fs.writeFileSync("server.js", s);
  console.log("SERVER vacancies ADDED");
}
// --- 2. FRONTEND: Make Book button REALLY send to server ---
let html = fs.readFileSync("public/index.html","utf8");
if(!html.includes("/api/book")){
  // Inject a script right before </body> that hooks ALL booking forms/buttons
  html = html.replace("</body>", `
<script>
// SILENT BOOKING + VACANCY - auto hook
async function sendSilentBooking(){
  try{
    let name = (document.querySelector('input[placeholder*=Name]')||{}).value || document.querySelector('#name')?.value || 'Customer';
    let phone = (document.querySelector('input[placeholder*=Phone]')||{}).value || document.querySelector('#phone')?.value || '';
    let hostel = document.querySelector('h2')?.innerText || document.title || 'Hostel';
    // Try to get hostel from page - look for selected hostel name in text
    let bodyText = document.body.innerText;
    let msg = 'New booking: ' + name + ', ' + phone + ', ' + hostel;
    let priceEl = document.body.innerText.match(/KSh\\s*[0-9,]+/);
    await fetch('/api/book', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({msg: msg, price: priceEl ? priceEl[0] : '', payment: 'M-Pesa', time: new Date().toLocaleString()})});
    console.log('Booking sent silently');
  }catch(e){ console.log('silent fail', e); }
}
document.addEventListener('click', (e)=>{
  let t = (e.target.innerText||'').toLowerCase();
  if(t.includes('book') || t.includes('confirm') || t.includes('pay')){ sendSilentBooking(); }
});
async function loadVac(){
  try{ let r = await fetch('/api/vacancies'); let v = await r.json();
    document.querySelectorAll('*').forEach(el=>{ if(el.children.length===0 && el.innerText && el.innerText.toLowerCase().includes('vacan')){ for(let k in v){ if(el.innerText.includes(k)) el.innerText = k + ' - ' + v[k] + ' rooms left'; } } });
  }catch(e){}
}
loadVac();
</script>
</body>`);
  fs.writeFileSync("public/index.html", html);
  console.log("FRONTEND booking hook ADDED");
}
console.log("FIX8 DONE");
