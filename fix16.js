const fs = require('fs');
let s = fs.readFileSync("server.js","utf8");
// Delete the line that loads old vacancies.json - this is what was blocking you
s = s.split("\n").filter(line => !line.includes("existsSync('vacancies.json')") && !line.includes('existsSync("vacancies.json")')).join("\n");
// Also make sure vacancies are forced
s = s.replace(/VACANCIES\s*=\s*\{[^}]+\}/, `VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 }`);
fs.writeFileSync("server.js", s);
console.log("Line 10 deleted - now it will ALWAYS use 50/48/45/47");
console.log(s.split("\n").slice(8,13).join("\n"));
