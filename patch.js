const fs=require('fs');
let s=fs.readFileSync('server.js','utf8');
if(!s.includes('PRICES')){
  s=s.replace('let VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 };',
  'let VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 };\nconst PRICES = { "Sunrise": 5000, "Green View": 5500, "Sunset": 6000, "Riverside": 6500 };');
}
if(!s.includes('req.body.price')){
  s=s.replace('BOOKINGS.push(req.body);',
  "let _h = req.body.hostel || req.body.Hostel || '';\n  let _rooms = parseInt(req.body.rooms || req.body.Rooms || 1) || 1;\n  req.body.price = (PRICES[_h] || 0) * _rooms;\n  req.body.amount = req.body.price;\n  BOOKINGS.push(req.body);");
}
fs.writeFileSync('server.js',s);
console.log('patched OK');
