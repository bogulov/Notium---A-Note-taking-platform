# Notium - Quick Start Guide

## ✅ Project Status

Both servers are now running:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## 🚀 Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📋 What's Working

### Frontend Features
- ✅ 3-column layout (Sidebar | NoteList | Editor)
- ✅ Create, edit, and delete notes
- ✅ Rich text editor (TipTap)
- ✅ Folder organization
- ✅ Search functionality
- ✅ AI Panel (OpenAI integration)
- ✅ Export notes as Markdown/Text
- ✅ Responsive design

### Backend Features
- ✅ RESTful API on port 8000
- ✅ JWT Authentication
- ✅ Notes CRUD operations
- ✅ Folders management
- ✅ AI service integration
- ✅ Health check endpoint

## 🔑 API Key Configuration

Your OpenAI API key has been configured in:
- `frontend/.env` - For client-side AI features
- `backend/.env` - For server-side AI features

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Authentication
```bash
POST http://localhost:8000/api/v1/auth/register
POST http://localhost:8000/api/v1/auth/login
GET  http://localhost:8000/api/v1/auth/me
```

### Notes
```bash
GET    http://localhost:8000/api/v1/notes
POST   http://localhost:8000/api/v1/notes
GET    http://localhost:8000/api/v1/notes/:id
PUT    http://localhost:8000/api/v1/notes/:id
DELETE http://localhost:8000/api/v1/notes/:id
```

### AI
```bash
POST http://localhost:8000/api/v1/ai/generate
POST http://localhost:8000/api/v1/ai/improve
POST http://localhost:8000/api/v1/ai/summarize
```

## 🛠️ Development Commands

### Start Both Servers
```bash
npm run dev
```

### Start Separately
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Database Setup (if needed)

**1. Start PostgreSQL and create DB (Arch Linux)**  
If you see `P1001: Can't reach database server at localhost:5432`:

```bash
cd backend
./scripts/setup-db.sh
```

Or manually:
```bash
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER \"user\" WITH PASSWORD 'password' CREATEDB;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER \"user\" WITH PASSWORD 'password';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE notium OWNER \"user\";" 2>/dev/null || true
```

**2. Run migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## 📝 Next Steps

1. **Set up Database** (if not already done):
   - Install PostgreSQL
   - Update `backend/.env` with your DATABASE_URL
   - Run migrations: `cd backend && npx prisma migrate dev`

2. **Test the Application**:
   - Open http://localhost:3000
   - Create a note
   - Try the AI features (Cmd+K or click AI button)
   - Test search functionality

3. **Optional Enhancements**:
   - Add Redis for caching
   - Set up S3/R2 for file storage
   - Configure email service
   - Add monitoring (Sentry)

## 🐛 Troubleshooting

### Backend not starting? / P1001 "Can't reach database server"
- **Start PostgreSQL**: `sudo systemctl start postgresql`
- **Ensure user and DB exist**: run `backend/scripts/setup-db.sh` (see Database Setup above)
- Verify `DATABASE_URL` in `backend/.env` matches (user `user`, password `password`, DB `notium`)
- Check if port 8000 is available

### Frontend not loading?
- Check if port 3000 is available
- Verify all dependencies are installed: `cd frontend && npm install`
- Check browser console for errors

### AI features not working?
- Verify OPENAI_API_KEY is set in both `.env` files
- Check API key is valid
- Review browser console for errors

## 📚 Documentation

- See `README.md` for full documentation
- See `TO-DO.md` for implementation status
- See `BACKEND.md`, `DESIGN.md`, `PRD.md`, `TECH.md` for detailed specs

---

**Happy Coding! 🎉**
