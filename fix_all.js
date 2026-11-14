const fs=require('fs');
// --- 1. FRONTEND ---
let h=fs.readFileSync('public/index.html','utf8');
// Fix KSh displays in file order: Sunrise, Green View, Budget, MKU, Thika, Excel
const KSH_IN_ORDER=[5500,6000,4500,6500,5000,7000];
let i=0;
h=h.replace(/KSh\s*\d+\s*\/\s*month/g, ()=> 'KSh '+KSH_IN_ORDER[i++]+' / month');
// Fix book() prices by name
const M={'Sunrise':'5500','Green View Hostel':'6000','Budget Stay':'4500','MKU Heights':'6500','Thika Gateway':'5000','Excel Hostel':'7000'};
for(let n in M){
  h=h.replace(new RegExp(`('${n.replace(/ /g,'\\s+')}'\\s*,\\s*')\\d+(')`, 'g'), '$1'+M[n]+'$2');
}
fs.writeFileSync('public/index.html',h);
console.log('frontend OK, KSh replaced:',i);

// --- 2. BACKEND ---
let s=fs.readFileSync('server.js','utf8');
s=s.replace(/const PRICES = \{[^}]+\};/,
`const PRICES = { "Sunrise": 5500, "Green View Hostel": 6000, "Green View": 6000, "Budget Stay": 4500, "MKU Heights": 6500, "Thika Gateway": 5000, "Excel Hostel": 7000, "Excel": 7000 };`);
s=s.replace(/let VACANCIES = \{[^}]+\};/,
`let VACANCIES = { "Sunrise": 50, "Green View Hostel": 48, "Budget Stay": 45, "MKU Heights": 47, "Thika Gateway": 46, "Excel Hostel": 44 };`);
s=s.replace(/let hostels = \[[^\]]+\];/,
`let hostels = ['Sunrise','Green View Hostel','Budget Stay','MKU Heights','Thika Gateway','Excel Hostel'];`);
fs.writeFileSync('server.js',s);
console.log('backend OK');
