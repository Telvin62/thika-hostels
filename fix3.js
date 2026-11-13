const fs = require('fs');
let html = fs.readFileSync("public/index.html","utf8");
// 1. Remove floating Pay button + floating Pay box completely
html = html.replace(/<button id="payToggle".*?<\/button>/s, '');
html = html.replace(/<div id="payBox">.*?<\/div>\s*<script>/s, '<script>');
// 2. Add smart Book Now logic - each hostel pays for itself
let smart = `
<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach(btn => {
    if(btn.textContent.includes('Book Now')){
      // Find hostel name from same card
      let card = btn.closest('div') || document.body;
      let name = 'Hostel';
      let all = card.parentElement ? card.parentElement.innerText : '';
      let m = all.match(/(Sunrise Hostel Thika|Green View Hostel|Budget Stay|MKU Heights|Thika Gateway|Excel Hostel)/);
      if(m) name = m[1];
      // Find price too
      let price = '3500';
      let pm = all.match(/KSh\\s*(\\d+)/);
      if(pm) price = pm[1];
      btn.onclick = (e) => {
        e.preventDefault();
        let inputs = card.parentElement.querySelectorAll('input');
        let fullName = inputs[0] ? inputs[0].value : '';
        let phone = inputs[1] ? inputs[1].value : '';
        if(!fullName) fullName = prompt('Your Full Name:') || 'Guest';
        if(!phone) phone = prompt('M-Pesa Phone:') || '0716921326';
        if(confirm('Pay KSh ' + price + ' for ' + name + ' via M-Pesa TEST to ' + phone + '?')){
          alert('✅ TEST SUCCESS! M-Pesa STK Push Sent to ' + phone + ' for ' + name + ' - KSh ' + price + '. No real money charged.');
          window.open('https://wa.me/254716921326?text=' + encodeURIComponent('Hi! New Booking: ' + fullName + ' - ' + phone + ' - ' + name + ' - KSh ' + price + ' - TEST PAID'), '_blank');
        }
      };
    }
  });
});
</script>
`;
html = html.replace('</body>', smart + '\n</body>');
fs.writeFileSync("public/index.html", html);
console.log("FIXED3 OK - Pay now on each hostel");
