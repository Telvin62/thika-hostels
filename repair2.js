const fs = require('fs');
let lines = fs.readFileSync("server.js","utf8").split("\n");
console.log("LINES 40-55:");
for(let i=39;i<55 && i<lines.length;i++) console.log((i+1)+": "+lines[i]);
if(lines[47] && lines[47].trim() === "}"){
  console.log("Deleting stray } on line 48");
  lines.splice(47,1);
  fs.writeFileSync("server.js", lines.join("\n"));
}
