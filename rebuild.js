const fs=require('fs');
let hostels=[
 ["🌅","Sunrise Hostel Thika","Thika Town","3500","11"],
 ["🌿","Green View Hostel","Near MKU","4000","5"],
 ["💰","Budget Stay","Thika Road","2500","18"],
 ["🏫","MKU Heights","Opposite MKU Gate","4500","20"],
 ["🏟️","Thika Gateway","Near Thika Stadium","3000","32"],
 ["⭐","Excel Hostel","Section 9, Thika","5000","8"],
];
let cards=hostels.map(h=>`
<div style="background:#fff;border-radius:16px;padding:16px;margin:14px;box-shadow:0 2px 10px rgba(0,0,0,.08)">
<div style="font-size:40px">${h[0]}</div>
<h2 style="margin:8px 0">${h[1]}</h2>
<p>📍 ${h[2]}</p>
<p style="color:green;font-weight:bold;font-size:18px">KSh ${h[3]} / month</p>
<p>🛏️ ${h[4]} rooms available</p>
<input placeholder="Your Full Name" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
<input placeholder="M-Pesa Phone e.g 0769751803" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ddd;border-radius:10px;box-sizing:border-box">
<button onclick="book(this,'${h[1]}','${h[3]}')" style="width:100%;padding:14px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-weight:bold;font-size:16px">Book Now + Pay with M-Pesa</button>
</div>`).join('');
let html=`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thika Hostels</title></head>
<body style="font-family:sans-serif;background:#f6f6f6;margin:0;padding-bottom:80px">
<h1 style="text-align:center;padding:20px 10px 0">🏠 Thika Hostels</h1>
<p style="text-align:center;color:#555">Book your hostel in Thika - by Telvin Asher Abel</p>
${cards}
<a href="https://wa.me/254716921326?text=Hi!%20I%20want%20to%20book%20a%20hostel" target="_blank" style="position:fixed;bottom:20px;right:20px;width:56px;height:56px;background:#25D366;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,.3);z-index:999">💬</a>
<script>
function book(btn,name,price){
  let card=btn.parentElement;
  let inputs=card.querySelectorAll('input');
  let fullName=inputs[0].value.trim();
  let phone=inputs[1].value.trim();
  if(!fullName){ alert('Please enter your Full Name first'); inputs[0].focus(); return; }
  if(!phone){ alert('Please enter your M-Pesa Phone first'); inputs[1].focus(); return; }
  let m=prompt('PAYMENT METHOD for '+name+' - KSh '+price+'\\n\\n1 = M-Pesa STK Push (PIN on your phone)\\n2 = M-Pesa Till Number\\n3 = Cash on Arrival\\n\\nType 1, 2 or 3:');
  if(m==='1'){ alert('✅ TEST SUCCESS! M-Pesa STK Push Sent to '+phone+' for '+name+' - KSh '+price+'.\\nCheck your phone and enter PIN.\\nNo real money charged.'); }
  else if(m==='2'){ alert('Pay via M-Pesa Till:\\nTill: 0716921326\\nAmount: KSh '+price+'\\nFor: '+name+'\\nName: '+fullName+'\\nKeep SMS as proof.'); }
  else if(m==='3'){ alert('Cash on Arrival selected.\\nRoom reserved for '+fullName+' ('+phone+') - '+name+' KSh '+price+'. Pay when you arrive.'); }
}
</script></body></html>`;
fs.writeFileSync("public/index.html", html);
console.log("REBUILT OK - Clean version");
