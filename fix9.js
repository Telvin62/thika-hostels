const fs = require('fs');
// --- SERVER: Correct vacancies to match your real site ---
let s = fs.readFileSync("server.js","utf8");
// Reset vacancies to real numbers from your site
s = s.replace(/let VACANCIES = \{[^}]+\};/, `let VACANCIES = { "Sunrise Hostel Thika": 11, "Green View Hostel": 9, "Sunset Hostel": 8, "Riverside Hostel": 12 };`);
if(!s.includes("req.body.hostel")){
  s = s.replace("for(let k in VACANCIES){ if((req.body.msg||'').toLowerCase().includes(k.toLowerCase())){ if(VACANCIES[k]>0) VACANCIES[k]--; } }",
  `let hName = req.body.hostel || req.body.msg || '';
   for(let k in VACANCIES){ if(hName.toLowerCase().includes(k.toLowerCase().split(' ')[0].toLowerCase()) || hName.includes(k)){ if(VACANCIES[k]>0) VACANCIES[k]--; } }`);
}
fs.writeFileSync("server.js", s);

// --- FRONTEND: Fix per-card availability ---
let html = fs.readFileSync("public/index.html","utf8");
// Remove old broken hook if present
html = html.replace(/<script>\s*\/\/ SILENT BOOKING[\s\S]*?<\/script>/, '');
html = html.replace("</body>", `
<script>
// FIX9: Real vacancy per card
async function refreshVac(){
  try{
    let r = await fetch('/api/vacancies'); let v = await r.json();
    // Find every card that has "rooms available"
    document.body.innerHTML.split('rooms available').forEach(()=>{});
    let all = document.querySelectorAll('*');
    all.forEach(el=>{
      if(el.children.length===0 && el.textContent.includes('rooms available')){
        // Find hostel name in same card - go up 3 levels and look for hostel name
        let card = el; for(let i=0;i<5 && card.parentElement;i++){ card = card.parentElement; let txt = card.innerText||''; for(let k in v){ if(txt.includes(k.split(' Hostel')[0])){ el.textContent = '🛏️ ' + v[k] + ' rooms available'; if(v[k]===0) el.textContent = '❌ Fully Booked'; } } }
      }
    });
  }catch(e){}
}
refreshVac();
document.addEventListener('click', async (e)=>{
  let btn = e.target.closest('button');
  if(!btn) return;
  let t = (btn.innerText||'').toLowerCase();
  if(!t.includes('book') && !t.includes('pay')) return;
  // Find card = parent that contains hostel name + inputs
  let card = btn; for(let i=0;i<6 && card.parentElement;i++){ card = card.parentElement; if(card.querySelector('input')) break; }
  let inputs = card.querySelectorAll('input');
  let name = inputs[0]?.value || '';
  let phone = inputs[1]?.value || inputs[0]?.value || '';
  let hostel = '';
  let cardText = card.innerText||'';
  if(cardText.includes('Sunrise')) hostel = 'Sunrise Hostel Thika';
  else if(cardText.includes('Green View')) hostel = 'Green View Hostel';
  else if(cardText.includes('Sunset')) hostel = 'Sunset Hostel';
  else if(cardText.includes('Riverside')) hostel = 'Riverside Hostel';
  else hostel = cardText.split('\\n')[0] || 'Hostel';
  let priceMatch = cardText.match(/KSh\\s*[0-9,]+/);
  try{
    await fetch('/api/book', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({msg: 'New booking: '+name+', '+phone+', '+hostel, hostel: hostel, price: priceMatch?priceMatch[0]:'', payment: 'M-Pesa', time: new Date().toLocaleString()})});
    console.log('SENT booking for', hostel);
  }catch(err){}
  // Update display immediately, then reload from server in 1 sec
  setTimeout(refreshVac, 800);
});
</script>
</body>`);
fs.writeFileSync("public/index.html", html);
console.log("FIX9 DONE");
