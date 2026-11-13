const fs = require('fs');
let html = fs.readFileSync("public/index.html","utf8");
// Fix Pay button - force small size, not full width
html = html.replace('id="payToggle"', 'id="payToggle" style="width:auto !important;min-width:90px;max-width:130px"');
// Also move WhatsApp up a bit so they never overlap
html = html.replace('#waBtn{position:fixed;bottom:20px;', '#waBtn{position:fixed;bottom:85px;');
fs.writeFileSync("public/index.html", html);
console.log("FIXED2 OK");
