# Setup Checklist - Inventory Management System

Use this checklist to verify your setup is complete and everything is working correctly.

## 📋 Pre-Setup Verification

- [ ] Node.js v18+ installed
  \`\`\`bash
  node --version
  \`\`\`
  
- [ ] Docker Desktop installed and running
  \`\`\`bash
  docker --version
  \`\`\`

- [ ] npm package manager available
  \`\`\`bash
  npm --version
  \`\`\`

---

## 🔧 Installation Steps

### Step 1: Dependencies
- [ ] Run: \`npm install\`
- [ ] Verify: Check for no errors in console
- [ ] Expected: ~440 packages installed

### Step 2: Environment Setup
- [ ] File \`.env\` exists in root
- [ ] Contains: \`DATABASE_URL="postgresql://inventory_user:inventory_pass@localhost:5432/inventory_db?schema=public"\`

### Step 3: Database Container
- [ ] Run: \`docker compose up -d\`
- [ ] Verify: \`docker ps\` shows \`inventory_postgres\` container
- [ ] Status: Container should be "Up" and healthy

### Step 4: Prisma Setup
- [ ] Run: \`npm run prisma:generate\`
  - [ ] Success: Prisma Client generated
  - [ ] Location: \`node_modules/@prisma/client\`

- [ ] Run: \`npm run prisma:migrate\`
  - [ ] Enter migration name: \`init\`
  - [ ] Success: Migration files created in \`prisma/migrations\`
  - [ ] Database: 8 tables created

- [ ] Run: \`npm run prisma:seed\`
  - [ ] Success: ✓ Created warehouses
  - [ ] Success: ✓ Created suppliers
  - [ ] Success: ✓ Created customers
  - [ ] Success: ✓ Created users
  - [ ] Success: ✓ Created 10 products
  - [ ] Message: ✅ Database seeding completed successfully!

### Step 5: Start Application
- [ ] Run: \`npm run dev\`
- [ ] Output shows: \`ready - started server on 0.0.0.0:3000\`
- [ ] Output shows: \`Local: http://localhost:3000\`
- [ ] No compilation errors

---

## ✅ Functionality Tests

### Home Page (/)
- [ ] Navigate to: http://localhost:3000
- [ ] Page loads without errors
- [ ] See: "Inventory Management System" title
- [ ] See: Two navigation cards (Dashboard, Products)
- [ ] See: Features list with 6 items
- [ ] Click: Dashboard card → redirects to /dashboard
- [ ] Click: Products card → redirects to /products

### Dashboard (/dashboard)
- [ ] Navigate to: http://localhost:3000/dashboard
- [ ] See: 4 statistic cards
  - [ ] Total Products: 10
  - [ ] Inventory Value: > $0
  - [ ] Total Stock: > 0
  - [ ] Low Stock Items: varies
- [ ] See: Products by Warehouse section
  - [ ] Main Warehouse: X products
  - [ ] Secondary Warehouse: X products
- [ ] See: Low Stock Alert section (if any)
- [ ] Click: "View All Products" button → redirects to /products
- [ ] Click: "Add New Product" button → redirects to /products/new

### Products List (/products)
- [ ] Navigate to: http://localhost:3000/products
- [ ] See: Products table with 10 items
- [ ] Table shows: Name, SKU, Price, Stock, Warehouse, Actions
- [ ] Search box works:
  - [ ] Type: "laptop" → filters results
  - [ ] Type: "LAP-HP-001" → shows one result
  - [ ] Clear search → shows all products
- [ ] Warehouse filter works:
  - [ ] Select: "Main Warehouse" → filters results
  - [ ] Select: "All Warehouses" → shows all
- [ ] Stock badges show:
  - [ ] Green for sufficient stock
  - [ ] Red for low stock
- [ ] Action buttons visible:
  - [ ] + (Add stock)
  - [ ] - (Remove stock)
  - [ ] Edit
  - [ ] Delete

### Add Product (/products/new)
- [ ] Navigate to: http://localhost:3000/products/new
- [ ] Form displays with fields:
  - [ ] Product Name (required)
  - [ ] SKU (required)
  - [ ] Unit Price (required)
  - [ ] Current Quantity
  - [ ] Min Quantity
  - [ ] Max Quantity
  - [ ] Warehouse (dropdown)
- [ ] Test: Click "Create Product" without filling → validation errors
- [ ] Test: Fill all required fields
  - [ ] Product Name: Test Product
  - [ ] SKU: TEST-001
  - [ ] Unit Price: 99.99
  - [ ] Quantity: 50
- [ ] Click: "Create Product"
- [ ] Success: Alert "Product created successfully!"
- [ ] Redirect: Back to /products
- [ ] Verify: New product appears in list

### Edit Product (/products/:id)
- [ ] From products list, click "Edit" on any product
- [ ] Page loads with pre-filled form
- [ ] Fields contain current values
- [ ] Change: Product Name to something new
- [ ] Change: Price to different value
- [ ] Click: "Update Product"
- [ ] Success: Alert "Product updated successfully!"
- [ ] Redirect: Back to /products
- [ ] Verify: Updated values show in list

### Stock Management
- [ ] From products list, click "+" on a product
- [ ] Prompt: "Enter quantity to add:"
- [ ] Enter: 10
- [ ] Success: Alert "Stock added successfully"
- [ ] Verify: Quantity increased by 10
- [ ] Click "-" on same product
- [ ] Prompt: "Enter quantity to remove:"
- [ ] Enter: 5
- [ ] Success: Alert "Stock removed successfully"
- [ ] Verify: Quantity decreased by 5

### Delete Product
- [ ] From products list, click "Delete" on test product
- [ ] Confirm: Confirmation dialog appears
- [ ] Click: OK
- [ ] Success: Alert "Product deleted successfully"
- [ ] Verify: Product removed from list

---

## 🔌 API Tests

### Using PowerShell

#### Test 1: Get All Products
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Get
\`\`\`
- [ ] Returns: JSON with success: true
- [ ] Returns: Array of products
- [ ] Returns: count field

#### Test 2: Search Products
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/products?search=laptop" -Method Get
\`\`\`
- [ ] Returns: Filtered products
- [ ] Returns: Products matching "laptop"

#### Test 3: Get Dashboard Stats
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Method Get
\`\`\`
- [ ] Returns: Dashboard statistics
- [ ] Returns: totalProducts, totalInventoryValue, etc.

#### Test 4: Get Warehouses
\`\`\`powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/warehouses" -Method Get
\`\`\`
- [ ] Returns: List of warehouses
- [ ] Returns: Product counts for each

#### Test 5: Create Product (API)
\`\`\`powershell
$body = @{
    productName = "API Test Product"
    sku = "API-TEST-001"
    unitPrice = 29.99
    quantity = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method Post -Body $body -ContentType "application/json"
\`\`\`
- [ ] Returns: Created product
- [ ] Returns: success: true
- [ ] Returns: message: "Product created successfully"

#### Test 6: Update Stock (API)
\`\`\`powershell
$body = @{
    quantity = 15
    type = "add"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/products/1/stock" -Method Patch -Body $body -ContentType "application/json"
\`\`\`
- [ ] Returns: Updated product
- [ ] Returns: Increased quantity

---

## 🗄️ Database Verification

### Using Prisma Studio
\`\`\`bash
npm run prisma:studio
\`\`\`
- [ ] Opens: http://localhost:5555
- [ ] See: 8 tables listed
  - [ ] users
  - [ ] warehouses
  - [ ] suppliers
  - [ ] customers
  - [ ] products
  - [ ] purchases
  - [ ] sales
  - [ ] stock_movements
- [ ] Click: products table
  - [ ] See: 10+ rows
  - [ ] See: All product details
- [ ] Click: warehouses table
  - [ ] See: 2 rows
- [ ] Click: stock_movements table
  - [ ] See: Movement records (if stock was updated)

### Using Docker
\`\`\`bash
docker exec -it inventory_postgres psql -U inventory_user -d inventory_db
\`\`\`
- [ ] Connects: PostgreSQL prompt appears
- [ ] Run: \`\dt\` (list tables)
  - [ ] See: 8 tables
- [ ] Run: \`SELECT COUNT(*) FROM products;\`
  - [ ] Returns: 10+ rows
- [ ] Exit: \`\q\`

---

## 🎨 UI/UX Verification

### Responsive Design
- [ ] Desktop (>1024px): Layout looks good
- [ ] Tablet (768px-1024px): Layout adapts
- [ ] Mobile (<768px): Mobile-friendly

### Loading States
- [ ] Products page shows loading spinner initially
- [ ] Dashboard shows loading spinner initially
- [ ] Form buttons show "Creating..." / "Updating..." during submission

### Error Handling
- [ ] Try creating product with duplicate SKU → Error message
- [ ] Try removing more stock than available → Error message
- [ ] Navigate to /products/99999 → "Product not found" or redirect

### Visual Polish
- [ ] Consistent colors and styling
- [ ] Icons display correctly
- [ ] Hover effects work
- [ ] Buttons have proper states (hover, active, disabled)
- [ ] Cards have shadows
- [ ] Transitions smooth

---

## 📚 Documentation Check

- [ ] README.md exists and is complete
- [ ] API_DOCUMENTATION.md exists with all endpoints
- [ ] QUICKSTART.md exists with quick setup
- [ ] PROJECT_SUMMARY.md exists with project overview
- [ ] All .md files render correctly in editor

---

## 🐛 Common Issues Checklist

If something doesn't work:

### Database Issues
- [ ] Docker container running? \`docker ps\`
- [ ] Database accessible? \`docker compose logs postgres\`
- [ ] Migrations applied? \`npm run prisma:migrate\`
- [ ] Seed data loaded? \`npm run prisma:seed\`

### Application Issues
- [ ] Dependencies installed? \`npm install\`
- [ ] Prisma Client generated? \`npm run prisma:generate\`
- [ ] No port conflicts? Check port 3000 is free
- [ ] Environment variables set? Check .env file

### Build Issues
- [ ] TypeScript errors? Check error messages
- [ ] Missing imports? Run \`npm install\`
- [ ] Prisma errors? Regenerate client

---

## ✨ Final Verification

- [ ] All pages load without errors
- [ ] All CRUD operations work
- [ ] Search and filter work
- [ ] Stock updates work
- [ ] Dashboard shows correct stats
- [ ] No console errors in browser
- [ ] API endpoints respond correctly
- [ ] Database has sample data
- [ ] Documentation is accessible

---

## 🎉 Success Criteria

Your setup is complete when:
✅ All checkboxes above are checked  
✅ Application runs on http://localhost:3000  
✅ Database container is running  
✅ All 10 sample products visible  
✅ Dashboard shows statistics  
✅ CRUD operations work  
✅ No errors in browser console  
✅ API endpoints respond correctly  

---

**Date Completed:** _______________  
**Completed By:** _______________  
**Time Taken:** _______________

---

**Congratulations! Your Inventory Management System is ready! 🎊**
