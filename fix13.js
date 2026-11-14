const fs = require('fs');
let s = fs.readFileSync("server.js","utf8");
// Make vacancies pretty + table scroll on phone
s = s.replace("document.getElementById('vac').innerText=JSON.stringify(d.vacancies||{});",
`let v=d.vacancies||{};
   document.getElementById('vac').innerHTML=Object.keys(v).map(k=>'<span style="display:inline-block;background:#eef2ff;border:1px solid #c7d2fe;padding:6px 10px;border-radius:20px;margin:3px;font-size:13px">🛏️ '+k+': <b>'+v[k]+' left</b></span>').join('');`);
s = s.replace("<table><tr><th>#</th>", "<div style='overflow-x:auto'><table style='min-width:600px'><tr><th>#</th>");
s = s.replace("</table></div>", "</table></div></div>");
// Make table header sticky and nicer - add style if not present
if(!s.includes(".vac-badge")){ s = s.replace("td{padding:10px", "td{padding:10px;white-space:nowrap"); }
fs.writeFileSync("server.js", s);
console.log("FIX13 DONE - Pretty vacancies");
