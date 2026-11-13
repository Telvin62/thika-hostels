const fs = require('fs');
let html = fs.readFileSync("public/index.html","utf8");
let code = `
<!-- WHATSAPP + TEST PAYMENT -->
<style>
#waBtn{position:fixed;bottom:20px;right:20px;background:#25D366;color:#fff;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;text-decoration:none;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.3)}
#payBox{position:fixed;bottom:20px;left:20px;background:#fff;border:2px solid #111;border-radius:12px;padding:12px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);max-width:240px}
#payBox button{width:100%;margin:4px 0;padding:10px;border:none;border-radius:8px;font-weight:bold;cursor:pointer}
</style>
<a id="waBtn" href="https://wa.me/254716921326?text=Hi!%20I%20want%20to%20book%20a%20hostel%20in%20Thika" target="_blank">💬</a>
<div id="payBox">
<b>💳 Pay (TEST MODE)</b><br><small>No real money moves</small><br>
<button style="background:#4CAF50;color:#fff" onclick="payMpesa()">M-Pesa (Test)</button>
<button style="background:#FFC107" onclick="payCash()">Cash on Arrival</button>
<button style="background:#25D366;color:#fff" onclick="payWa()">Pay via WhatsApp</button>
<div id="payMsg" style="font-size:13px;margin-top:6px"></div>
</div>
<script>
function payMpesa(){
 let phone = prompt("Enter M-Pesa number for TEST (e.g 0716921326):","0716921326");
 if(!phone) return;
 document.getElementById('payMsg').innerHTML = "Sending TEST STK Push to "+phone+"...";
 setTimeout(()=>{ document.getElementById('payMsg').innerHTML = "TEST SUCCESS! M-Pesa STK Push Sent to "+phone+"<br>No real money was charged."; },1500);
}
function payCash(){ document.getElementById('payMsg').innerHTML = "Booked! Pay Cash on Arrival. We will confirm on WhatsApp."; }
function payWa(){ window.open("https://wa.me/254716921326?text=Hi!%20I%20want%20to%20pay%20for%20my%20hostel%20booking","_blank"); }
</script>
`;
if(!html.includes("waBtn")){
  html = html.replace("</body>", code + "\n</body>");
  fs.writeFileSync("public/index.html", html);
  console.log("ADDED OK");
} else {
  console.log("ALREADY ADDED");
}
