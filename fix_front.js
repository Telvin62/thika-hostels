const fs=require('fs');
let s=fs.readFileSync('public/index.html','utf8');
const NEW=[5000,5500,6000,6500];
let i=0;
s=s.replace(/KSh\s*\d+\s*\/\s*month/g, (m)=>{
  if(i>=NEW.length) return m;
  return 'KSh '+NEW[i++]+' / month';
});
console.log('replaced '+i+' prices');
// also fix any book(..., price) numbers if they exist - show them
console.log(s.match(/book\([^)]*\)/g));
fs.writeFileSync('public/index.html',s);
console.log('frontend fixed OK');
