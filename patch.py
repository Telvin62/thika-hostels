import re
s=open('server.js').read()
if 'PRICES' not in s:
    s=s.replace(
        'let VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 };',
        'let VACANCIES = { "Sunrise": 50, "Green View": 48, "Sunset": 45, "Riverside": 47 };\nconst PRICES = { "Sunrise": 5000, "Green View": 5500, "Sunset": 6000, "Riverside": 6500 };'
    )
# Calculate price before saving booking
if 'req.body.price' not in s:
    s=s.replace(
        'BOOKINGS.push(req.body);',
        "let _h = req.body.hostel || req.body.Hostel || req.body.name_hostel || '';\n  let _rooms = parseInt(req.body.rooms || req.body.Rooms || req.body.qty || 1) || 1;\n  req.body.price = (PRICES[_h] || 0) * _rooms;\n  req.body.amount = req.body.price;\n  BOOKINGS.push(req.body);"
    )
open('server.js','w').write(s)
print('patched OK')
