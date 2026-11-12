MPESA\_CONSUMER\_KEY=PS1PhX8Sg5VqaEAGeyLS2LWohRr9dvpw6JE30MX2WZdEP36s



MPESA\_CONSUMER\_SECRET=S5jurVpyxXFSGNBcob0v1KPNX3pj82e0zKRmDlqOeb4TJBdrjNQmf69F97LTgU3a



MPESA\_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919



MPESA\_SHORTCODE=174379



MPESA\_CALLBACK\_URL=https://4a60-197-248-198-113.ngrok-free.app/api/mpesa/callback





MPESA\_CALLBACK\_SECRET=0bf14f930429fc1c8d0ae2925c8dfe19d4cebb442fca9018



MPESA\_ENV=sandbox



Client app (meridian-front-end-navy.vercel.app)







Three things to remember for tomorrow

ngrok URL changes every time you restart it. If you test M-Pesa again, update MPESA\_CALLBACK\_URL in .env with the new URL. Vercel's env var stays as your real domain.



dm@gmail.com is on the grandfathered trial — expires 31 Oct 2026. If you need to test expiry behavior again, there's a test-expire-org.js pattern in my earlier message you can recreate.



When you get a real Paybill/Till from Safaricom — the code doesn't change. You just flip MPESA\_ENV=production and swap 3 env vars in Vercel.





**MERIDIAN-ADMIN CREDENTIALS**

**Admin dashboard (meridian-admin-ten.vercel.app)**

**NB: Database (MongoDB Atlas) = Two users: main + admin\_readonly**

Email	        karanjasolomon51@gmail.com

Password        FdI49bwa55ej27oY9dnHdg (If you lose it: edit the user → Edit Password → autogenerate → copy again. It's fine to regenerate)

totp           401546  885261  



admin\_readonly      zGHBhRrpGGJN8cAL





Admin dashboard: https://meridian-admin-ten.vercel.app

GitHub: muturi-beep/meridian-admin

Vercel project: meridian-admin



**Admin Dashboard Tasks**

1. "How many orgs signed up this week?" → Overview
2. "Who's behind on payments?" → Organizations → Pending filter
3. "How much MRR do we have?" → Overview → MRR chart
4. "Where does james@x.com belong?" → Users → search
5. "Did this tenant pay for October?" → Payments → filter by org
6. "What did I tell this client last week?" → Org detail → Notes
7. "Give me all orgs for a spreadsheet" → Organizations → Export CSV







