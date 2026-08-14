# Admin Login credentials:
 admin@megaclick.com
 password1234
# Setup — Windows PowerShell

Getting Victory Media Dashboard running locally. You will end up with **two
PowerShell terminals open side by side**, one per server, both left running.

Every command below is PowerShell. Note that Windows PowerShell 5.1 does **not**
support `&&` between commands — each line is run on its own.

---

## Before you start

| Requirement | Check with | Notes |
| --- | --- | --- |
| Node.js 18+ | `node -v` | Needed for native `fetch`, used by the backend |
| npm | `npm -v` | Ships with Node |
| MongoDB | `Test-NetConnection 127.0.0.1 -Port 27017` | Local install, or use an Atlas connection string |

If MongoDB is running locally, `TcpTestSucceeded : True` comes back.

---

## Terminal 1 — Backend (port 5000)

### 1. Go to the backend folder

Quote the path — the folder name contains spaces.

```powershell
cd "C:\prj\Everlive\Victory Media Dashboard\Backend"
```

### 2. Create your `.env`

```powershell
Copy-Item .env.example .env
notepad .env
```

Only three things must be filled in for the app to run. **Login returns a
500 error if the JWT secrets are blank** — the password check passes and then
token signing fails, so do not skip these.

```ini
MONGO_URI=mongodb://127.0.0.1:27017/victory_media
ACCESS_TOKEN_SECRET=<paste a long random string>
REFRESH_TOKEN_SECRET=<paste a different long random string>
```

Generate two random secrets and paste them in:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Everything else in `.env` is optional. Mail and SMS settings only affect
notification delivery — leave them blank and the app runs fine, it just won't
send email or texts.

### 3. Install dependencies

```powershell
npm install
```

### 4. Create your first admin account

The database starts empty, and every screen — including the one that adds
employees — sits behind an admin login. This script writes that first admin
directly so you can get in:

```powershell
node scripts/create-admin.js --email "you@example.com" --password "yourpassword" --name "Your Name"
```

Password must be at least 6 characters. To use a phone number instead, pass it
in E.164 format (leading `+` and country code):

```powershell
node scripts/create-admin.js --phone "+919876543210" --password "yourpassword" --name "Your Name"
```

Re-running with the same email promotes that account to admin and resets its
password, so it doubles as a password reset.

### 5. Start the backend

```powershell
npm run dev
```

Leave this running. You should see:

```
MongoDB connected: victory_media
Victory Media Dashboard API running on port 5000
```

Confirm it responds — **in a third, throwaway terminal**, since terminals 1 and
2 are both occupied:

```powershell
Invoke-RestMethod http://localhost:5000
```

Returns `✦  Victory Media Dashboard backend is running!`

---

## Terminal 2 — Frontend (port 8080)

Open a **second** PowerShell window (in Windows Terminal: `Ctrl+Shift+T`, or
click the `+`). Leave terminal 1 running the backend.

### 1. Go to the frontend folder

```powershell
cd "C:\prj\Everlive\Victory Media Dashboard\Frontend"
```

### 2. Create your `.env.local`

```powershell
Copy-Item .env.example .env.local
```

The defaults work as-is for local development — Vite proxies `/api`, `/media`,
and `/socket.io` to port 5000, so `VITE_API_URL` can stay blank.

Set `VITE_COMPANY_UPI_ID` if you want a real UPI ID shown on the sales screen
when a lead pays online. Left blank it displays `not-configured`.

### 3. Install dependencies

```powershell
npm install
```

### 4. Start the frontend

```powershell
npm run dev
```

Leave this running too. Vite prints:

```
➜  Local:   http://localhost:8080/
```

---

## Log in

Open <http://localhost:8080> in your browser. You will land on `/login`.

1. Select the **Admin** tab.
2. Switch the identifier to **Email** (it defaults to phone) if you created your
   admin with an email.
3. Enter the email and password from step 4 of terminal 1.

You land on the task board at `/tasks`. As an admin you see all four nav
sections: Tasks, Sales Pipeline, People, and Self Service.

---

## Daily use, after the first setup

Two terminals, one command each. No reinstalling, no re-creating the admin.

```powershell
# Terminal 1
cd "C:\prj\Everlive\Victory Media Dashboard\Backend"
npm run dev
```

```powershell
# Terminal 2
cd "C:\prj\Everlive\Victory Media Dashboard\Frontend"
npm run dev
```

Stop either server with `Ctrl+C`.

---

## Troubleshooting

**Login returns 500 / "secretOrPrivateKey must have a value"**
`ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are blank in `Backend\.env`.
Fill both in and restart the backend. A telltale sign: a *wrong* password
correctly returns "Invalid credentials" while the *right* one errors — the
password matched and token signing then failed.

**"No MongoDB URI found"**
`MONGO_URI` is missing from `Backend\.env`, or you started the server from the
wrong folder. `.env` is read relative to the Backend directory.

**Backend exits immediately with a Mongo connection error**
MongoDB isn't running. Check the service:

```powershell
Get-Service -Name MongoDB
Start-Service -Name MongoDB
```

**Port already in use**
Find and stop whatever holds the port (5000 for backend, 8080 for frontend):

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object OwningProcess
Stop-Process -Id <the OwningProcess number>
```

**`cd` fails with "positional parameter" errors**
The path has spaces in it and needs quotes:
`cd "C:\prj\Everlive\Victory Media Dashboard\Backend"`

**Frontend loads but every request 401s or fails**
The backend isn't running in terminal 1, or it crashed. Check that window.

**`npm run dev` isn't recognised in the Frontend folder**
You're likely still in `Backend`. Confirm with `Get-Location`.

**Login page rejects an employee account**
Employees sign in on the **Employee** tab, using the phone number or email and
password set for them in Team/Staff Management. The Admin tab only accepts
accounts whose role is `admin` — it returns "Access restricted to admins only"
for everyone else.
