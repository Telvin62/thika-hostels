const fs = require('fs');
let html = fs.readFileSync("public/index.html","utf8");
// Make payBox hidden by default + add small toggle button
html = html.replace('#payBox{position:fixed;bottom:20px;left:20px;', '#payBox{display:none;position:fixed;bottom:80px;left:20px;');
if(!html.includes("payToggle")){
  html = html.replace('<div id="payBox">', '<button id="payToggle" onclick="document.getElementById(\'payBox\').style.display = document.getElementById(\'payBox\').style.display===\'block\'?\'none\':\'block\'" style="position:fixed;bottom:20px;left:20px;background:#111;color:#fff;padding:12px 16px;border:none;border-radius:25px;font-weight:bold;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.3)">💳 Pay</button><div id="payBox">');
}
fs.writeFileSync("public/index.html", html);
console.log("FIXED OK");
