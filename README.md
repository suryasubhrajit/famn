# 🌙 Fun At Mid Night (FAMN)

> **Private, Ephemeral & Secure 2-Participant Real-Time Messaging App**  
> *No signups. No database tracking. Messages live strictly in temporary Upstash Redis memory with auto-expiration TTL.*

---

## 🌟 Key Features

* 🔒 **Private & Ephemeral**: Zero SQL/NoSQL database storage. All room metadata and chat messages reside exclusively in memory / Redis cache with auto-expiration TTL.
* 👥 **Strict 2-Person Room Lock**: Rooms automatically lock to a maximum of 2 participants per session. 3rd join attempts are rejected.
* ⚡ **Google Meet Style Room Codes**: Clean path URLs (e.g. `https://yofamn.vercel.app/tsy-cusn-bti`).
* 🎨 **Redesigned Dual Speech Bubble Logo & Brand Identity**: Custom vector SVG logos, favicons, dark/light theme toggle.
* ⏱️ **Auto-Destruction Lifecycles**: 5-minute fast auto-destruct when all participants leave a room.
* ⌨️ **Desktop Keyboard Hotkeys**:
  * `Ctrl + /` : Focus input box
  * `Ctrl + .` : Toggle emoji picker
  * `Ctrl + Shift + U` : Attach file / media
  * `Double-click row` : WhatsApp-style reply
  * `Esc` : Dismiss reply / close popups
* 🖼️ **Fixed Boofer Watermark Wallpaper**: Subtle stationary 3x3 tiled Boofer wallpaper background.
* 📱 **Boofer Integration**: Official Android App download links and "Powered by Boofer" sponsor section.
* 🛡️ **Zero-Cost Storage Garbage Collection**: Uploaded attachments are validated (max 10MB) and automatically purged after 1 hour.

---

## 🚀 Tech Stack

* **Frontend**: React (Vite), Material-UI (MUI), Lucide Icons, Socket.io-client, Emoji Picker React.
* **Backend**: Node.js, Express, Socket.io, Upstash Redis (ioredis), Multer.

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/suryasubhrajit/famn.git
cd famn
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
REDIS_URL=rediss://default:YOUR_UPSTASH_TOKEN@credible-wren-85513.upstash.io:6379
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📜 License
MIT License. Created for **Fun At Mid Night**.
