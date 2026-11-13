const fs = require('fs');
// 1. SERVER - make sure vacancies start at current real number: Sunrise = 9
let s = fs.readFileSync("server.js","utf8");
s = s.replace(/let VACANCIES = \{[^}]+\};/, `let VACANCIES = { "Sunrise": 9, "Green View": 9, "Sunset": 8, "Riverside": 12 };`);
if(!s.includes("VACANCIES[h]")){
  s = s.replace(/let hName[\s\S]*?try \{ fs\.writeFileSync\('vacancies\.json'/, `let h = (req.body.hostel||'').toLowerCase();
   for(let k in VACANCIES){ if(h.includes(k.toLowerCase())){ if(VACANCIES[k]>0) VACANCIES[k]--; } }
   try { fs.writeFileSync('vacancies.json'`);
}
fs.writeFileSync("server.js", s);

// 2. FRONTEND - give each vacancy a proper ID
let html = fs.readFileSync("public/index.html","utf8");
// Remove all old vacancy scripts
html = html.replace(/<script>\s*\/\/ FIX9[\s\S]*?<\/script>/, '');
html = html.replace(/<script>\s*\/\/ SILENT[\s\S]*?<\/script>/, '');
// Replace "X rooms available" text with a span we can update
html = html.replace(/(\d+)\s*rooms available/g, (m,n)=>`<span class="vac-count" data-vac="${n}">${n} rooms available</span>`);
// Add hostel name to each card - find Sunrise card and tag it
html = html.replace("</body>", `
<script>
// FIX10 - Vacancy that REALLY reduces
let VAC = {};
async function loadVac(){
  try{ let r = await fetch('/api/vacancies'); VAC = await r.json(); }catch(e){ return; }
  // Each card in order: 1st card = Sunrise, 2nd = Green View, etc.
  let cards = document.querySelectorAll('.vac-count');
  let hostels = ['Sunrise','Green View','Sunset','Riverside'];
  cards.forEach((el,i)=>{
    let h = hostels[i] || 'Sunrise';
    let left = VAC[h];
    if(left!==undefined){ el.textContent = left + ' rooms available'; if(left===0) el.textContent = '❌ Fully Booked'; }
  });
}
loadVac();
document.addEventListener('click', async (e)=>{
  let btn = e.target.closest('button'); if(!btn) return;
  if(!btn.innerText.toLowerCase().includes('book')) return;
  // Find which card was clicked
  let allBtns = Array.from(document.querySelectorAll('button'));
  let idx = allBtns.findIndex(b=>b===btn);
  // Count only Book buttons
  let bookBtns = allBtns.filter(b=>b.innerText.toLowerCase().includes('book'));
  let cardIdx = bookBtns.findIndex(b=>b===btn);
  let hostels = ['Sunrise','Green View','Sunset','Riverside'];
  let hostel = hostels[cardIdx] || 'Sunrise';
  // Get name/phone from inputs near this button
  let card = btn.parentElement; let inputs = card.querySelectorAll('input');
  let name = inputs[0]?.value || 'Customer';
  let phone = inputs[1]?.value || '';
  try{
    await fetch('/api/book', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({msg: 'New booking: '+name+', '+phone+', '+hostel, hostel: hostel, price: '', payment: 'M-Pesa', time: new Date().toLocaleString()})});
    // Instantly reduce on screen, even before refresh
    if(VAC[hostel]!==undefined && VAC[hostel]>0) VAC[hostel]--;
    loadVac();
  }catch(err){}
});
</script>
</body>`);
fs.writeFileSync("public/index.html", html);
console.log("FIX10 DONE - Sunrise starts at 9");
