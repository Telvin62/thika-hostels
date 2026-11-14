const fs = require('fs');
// 1. Update server default to 45-50
let s = fs.readFileSync("server.js","utf8");
s = s.replace(/let VACANCIES = \{[^}]+\};/, `let VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 };`);
fs.writeFileSync("server.js", s);
// 2. Delete old small vacancies file so server uses new big numbers
try { fs.unlinkSync("vacancies.json"); console.log("Old vacancies deleted"); } catch(e){ console.log("No old file"); }
// 3. Create new vacancies file with big numbers
fs.writeFileSync("vacancies.json", JSON.stringify({ "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 }));
console.log("FIX14 DONE - Rooms now 45-50");
