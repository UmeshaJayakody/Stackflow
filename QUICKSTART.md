# Quick Start Guide - Inventory Management System

## ⚡ Quick Setup (5 minutes)

### Prerequisites Check
- ✅ Node.js installed? Run: \`node --version\` (need v18+)
- ✅ Docker installed? Run: \`docker --version\`
- ✅ Git installed? Run: \`git --version\`

---

## 🚀 Setup Steps

### Step 1: Install Dependencies
\`\`\`powershell
npm install
\`\`\`

### Step 2: Start Database
\`\`\`powershell
docker compose up -d
\`\`\`

### Step 3: Setup Database
\`\`\`powershell
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
\`\`\`

When prompted for migration name, type: \`init\`

### Step 4: Start Application
\`\`\`powershell
npm run dev
\`\`\`

### Step 5: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎯 What You Get

After setup, you'll have:
- ✅ 10 sample products
- ✅ 2 warehouses
- ✅ Full CRUD functionality
- ✅ Dashboard with statistics
- ✅ Search and filter features

---

## 🧪 Quick Test

### Test the API with PowerShell

**1. Get all products:**
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
\`\`\`

**2. Get dashboard stats:**
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Method Get
\`\`\`

**3. Create a product:**
\`\`\`powershell
$body = @{
    productName = "Test Product"
    sku = "TEST-001"
    unitPrice = 19.99
    quantity = 50
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -Body $body -ContentType "application/json"
\`\`\`

---

## 📱 Navigate the UI

1. **Home Page** - http://localhost:3000
2. **Dashboard** - http://localhost:3000/dashboard
3. **Products** - http://localhost:3000/products
4. **Add Product** - http://localhost:3000/products/new

---

## 🛠️ Useful Commands

\`\`\`powershell
# View database in browser
npm run prisma:studio

# Stop database
docker compose down

# Restart database
docker compose restart

# View database logs
docker compose logs -f

# Reset everything
docker compose down -v
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
\`\`\`

---

## ❌ Troubleshooting

### Docker not found?
Install from: https://www.docker.com/products/docker-desktop/

### Port 5432 already in use?
\`\`\`powershell
# Stop other PostgreSQL services
docker compose down
netstat -ano | findstr :5432
\`\`\`

### Database connection error?
\`\`\`powershell
# Check if container is running
docker ps

# Restart container
docker compose restart

# View logs
docker compose logs postgres
\`\`\`

### Prisma errors?
\`\`\`powershell
# Regenerate client
npm run prisma:generate

# Reset database
docker compose down -v
docker compose up -d
npm run prisma:migrate
\`\`\`

---

## 📚 Next Steps

1. ✅ Explore the dashboard at `/dashboard`
2. ✅ Add a new product at `/products/new`
3. ✅ Try search and filter features
4. ✅ Test stock updates (+/- buttons)
5. ✅ Review API documentation in `API_DOCUMENTATION.md`
6. ✅ Test APIs with Postman

---

## 🎉 You're Ready!

Your inventory management system is now running!

**Need help?** Check:
- 📖 README.md - Full documentation
- 📋 API_DOCUMENTATION.md - API reference
- 🐛 Troubleshooting section above

---

**Happy Inventory Managing! 📦**
