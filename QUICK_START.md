# ⚡ Quick Start - Production API

## 🚀 3 kroky na spustenie

### 1️⃣ Vytvorte `.env` súbor

**Windows (PowerShell):**
```powershell
cd frontend
.\create-env.bat
```

**Linux/Mac:**
```bash
cd frontend
chmod +x create-env.sh
./create-env.sh
```

**Alebo manuálne:**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:8080/api/v1" > .env
```

### 2️⃣ Reštartujte dev server

```bash
npm run dev
```

### 3️⃣ Otestujte

1. Otvorte aplikáciu v prehliadači
2. Otvorte DevTools (F12) → Network tab
3. Prihláste sa alebo načítajte príspevky
4. Skontrolujte, či requesty smerujú na `http://localhost:8080/api/v1`

## ✅ Hotovo!

Aplikácia je teraz prepojená s produkčným API.

---

## 📚 Potrebujete viac info?

- **Kompletný návod:** [API_MIGRATION_GUIDE.md](./API_MIGRATION_GUIDE.md)
- **Environment setup:** [ENV_SETUP.md](./ENV_SETUP.md)
- **Changelog:** [CHANGELOG_API_MIGRATION.md](./CHANGELOG_API_MIGRATION.md)

---

## 🆕 Nové funkcie

### Upload súborov
```typescript
import { FilesApi } from '@/services/api'
await FilesApi.uploadFile(postId, file)
```

### Moje likes
```typescript
import { LikesApi } from '@/services/api'
const likes = await LikesApi.getMyLikes()
```

### Cache management (admin)
```typescript
import { CacheApi } from '@/services/api'
await CacheApi.clearAllCaches()
```

---

## 🐛 Problémy?

### Backend nebeží?
```bash
# Skontrolujte, či backend beží
curl http://localhost:8080/api/v1/hello
```

### CORS error?
Backend musí povoliť `http://localhost:5173` v CORS konfigurácii.

### .env sa nenačíta?
1. Skontrolujte, či začína s `VITE_`
2. Reštartujte dev server
3. Vyčistite cache: `rm -rf node_modules/.vite`

---

**Happy coding! 🎉**

