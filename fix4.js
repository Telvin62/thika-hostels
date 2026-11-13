const fs = require('fs');
let html = fs.readFileSync("public/index.html","utf8");
// 1. Remove ALL WhatsApp auto-open from Book Now
html = html.replace(/window\.open\('https:\/\/wa\.me[^;]+;/g, '');
html = html.replace(/window\.open\("https:\/\/wa\.me[^;]+;/g, '');
// 2. Replace the TEST SUCCESS alert with Payment Method picker
html = html.replace(
  "alert('✅ TEST SUCCESS! M-Pesa STK Push Sent to ' + phone + ' for ' + name + ' - KSh ' + price + '. No real money charged.');",
  `
  let method = prompt('Choose Payment Method for ' + name + ' - KSh ' + price + ':\\n1 = M-Pesa STK Push\\n2 = M-Pesa Till / Paybill\\n3 = Cash on Arrival\\n\\nType 1, 2 or 3:');
  if(method === '1'){
    alert('✅ M-Pesa STK Push Sent to ' + phone + ' for ' + name + ' - KSh ' + price + '.\\nCheck your phone and enter PIN.\\nNo real money charged in TEST mode.');
  } else if(method === '2'){
    alert('Pay via M-Pesa Till:\\nTill Number: 0716921326\\nAmount: KSh ' + price + '\\nName: ' + name + '\\n\\nSend and keep SMS as proof.');
  } else if(method === '3'){
    alert('Cash on Arrival selected for ' + name + ' - KSh ' + price + '.\\nYour room is reserved for ' + fullName + ' (' + phone + '). Pay when you arrive.');
  } else {
    alert('Booking cancelled.');
  }
  `
);
fs.writeFileSync("public/index.html", html);
console.log("FIXED4 OK - No WhatsApp, Payment Method shown");
