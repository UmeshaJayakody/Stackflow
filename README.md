# Inventory Management System

A comprehensive inventory management application built with Next.js, PostgreSQL, and Prisma ORM. This system allows small stores to efficiently manage their product inventory with features for CRUD operations, stock tracking, search, filtering, and real-time statistics.

## 🚀 Features

- ✅ **Product Management**: Add, view, update, and delete products
- ✅ **Stock Control**: Add/remove stock with real-time tracking
- ✅ **Search & Filter**: Search products by name or SKU, filter by warehouse
- ✅ **Dashboard Analytics**: View inventory value, total products, and stock statistics
- ✅ **Low Stock Alerts**: Automatic alerts for products below minimum quantity
- ✅ **Warehouse Management**: Organize products across multiple warehouses
- ✅ **Responsive UI**: Built with Tailwind CSS for mobile and desktop
- ✅ **Stock Movement Tracking**: Complete audit trail of inventory changes

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS 4
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running PostgreSQL)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repository-url>
cd stackflow
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables
Copy the example environment file:
\`\`\`bash
copy .env.example .env
\`\`\`

The `.env` file should contain:
\`\`\`env
DATABASE_URL="postgresql://inventory_user:inventory_pass@localhost:5432/inventory_db?schema=public"
\`\`\`

### 4. Start PostgreSQL Database
Start the PostgreSQL container using Docker:
\`\`\`bash
docker compose up -d
\`\`\`

Verify the container is running:
\`\`\`bash
docker ps
\`\`\`

You should see a container named `inventory_postgres` running.

### 5. Run Database Migrations
Generate Prisma Client and create database tables:
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

When prompted for a migration name, enter something like: `init`

### 6. Seed the Database
Populate the database with sample data:
\`\`\`bash
npm run prisma:seed
\`\`\`

This will create:
- 2 warehouses
- 2 suppliers
- 2 customers
- 2 users
- 10 sample products

### 7. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

The application will be available at: **http://localhost:3000**

## 📊 Database Schema

The system uses 8 main tables:

1. **users** - System users with authentication
2. **warehouses** - Storage locations for products
3. **suppliers** - Product suppliers information
4. **customers** - Customer records
5. **products** - Main product inventory with stock levels
6. **purchases** - Purchase order records
7. **sales** - Sales transaction records
8. **stock_movements** - Audit trail for all stock changes

## 🔌 API Endpoints

### Products API

#### Get All Products
\`\`\`
GET /api/products
Query Parameters:
  - search (optional): Search by product name or SKU
  - warehouseId (optional): Filter by warehouse ID

Response:
{
  "success": true,
  "data": [...products],
  "count": 10
}
\`\`\`

#### Get Single Product
\`\`\`
GET /api/products/:id

Response:
{
  "success": true,
  "data": {
    "productId": 1,
    "productName": "Laptop HP ProBook 450",
    "sku": "LAP-HP-001",
    "unitPrice": 899.99,
    "quantity": 50,
    "minimumQuantity": 10,
    "maximumQuantity": 100,
    "warehouse": {...}
  }
}
\`\`\`

#### Create Product
\`\`\`
POST /api/products
Content-Type: application/json

Body:
{
  "productName": "New Product",
  "sku": "PROD-001",
  "unitPrice": 99.99,
  "quantity": 100,
  "minimumQuantity": 20,
  "maximumQuantity": 500,
  "warehouseId": 1
}

Response:
{
  "success": true,
  "data": {...created product},
  "message": "Product created successfully"
}
\`\`\`

#### Update Product
\`\`\`
PUT /api/products/:id
Content-Type: application/json

Body:
{
  "productName": "Updated Product Name",
  "unitPrice": 129.99,
  "quantity": 150
}

Response:
{
  "success": true,
  "data": {...updated product},
  "message": "Product updated successfully"
}
\`\`\`

#### Delete Product
\`\`\`
DELETE /api/products/:id

Response:
{
  "success": true,
  "message": "Product deleted successfully"
}
\`\`\`

#### Update Stock Quantity
\`\`\`
PATCH /api/products/:id/stock
Content-Type: application/json

Body:
{
  "quantity": 10,
  "type": "add"  // or "remove"
}

Response:
{
  "success": true,
  "data": {...updated product},
  "message": "Stock added successfully"
}
\`\`\`

### Dashboard API

#### Get Dashboard Statistics
\`\`\`
GET /api/dashboard

Response:
{
  "success": true,
  "data": {
    "totalProducts": 10,
    "totalInventoryValue": "123456.78",
    "totalStockQuantity": 1055,
    "lowStockCount": 2,
    "lowStockProducts": [...],
    "productsByWarehouse": [...],
    "recentStockMovements": [...]
  }
}
\`\`\`

### Warehouses API

#### Get All Warehouses
\`\`\`
GET /api/warehouses

Response:
{
  "success": true,
  "data": [
    {
      "warehouseId": 1,
      "warehouseName": "Main Warehouse",
      "location": "123 Main Street",
      "_count": {
        "products": 5
      }
    }
  ]
}
\`\`\`

## 🧪 Testing with Postman

### Import Collection
1. Open Postman
2. Create a new collection named "Inventory API"
3. Add the base URL variable: `http://localhost:3000`

### Example Test Cases

**1. Get All Products**
- Method: GET
- URL: `{{baseUrl}}/api/products`

**2. Search Products**
- Method: GET
- URL: `{{baseUrl}}/api/products?search=laptop`

**3. Create Product**
- Method: POST
- URL: `{{baseUrl}}/api/products`
- Body (JSON):
\`\`\`json
{
  "productName": "Wireless Mouse",
  "sku": "MOUSE-001",
  "unitPrice": 25.99,
  "quantity": 100,
  "minimumQuantity": 20,
  "maximumQuantity": 500,
  "warehouseId": 1
}
\`\`\`

**4. Update Stock**
- Method: PATCH
- URL: `{{baseUrl}}/api/products/1/stock`
- Body (JSON):
\`\`\`json
{
  "quantity": 10,
  "type": "add"
}
\`\`\`

**5. Get Dashboard Stats**
- Method: GET
- URL: `{{baseUrl}}/api/dashboard`

## 🎨 UI Pages

- **Home** (`/`) - Landing page with navigation
- **Dashboard** (`/dashboard`) - Analytics and statistics
- **Products List** (`/products`) - Browse all products with search/filter
- **Add Product** (`/products/new`) - Create new product form
- **Edit Product** (`/products/:id`) - Update product information

## 📝 Available Scripts

\`\`\`bash
# Development
npm run dev                 # Start development server

# Prisma
npm run prisma:generate     # Generate Prisma Client
npm run prisma:migrate      # Run database migrations
npm run prisma:seed         # Seed database with sample data
npm run prisma:studio       # Open Prisma Studio GUI

# Build
npm run build               # Build for production
npm start                   # Start production server

# Linting
npm run lint                # Run ESLint
\`\`\`

## 🐳 Docker Commands

\`\`\`bash
# Start PostgreSQL
docker compose up -d

# Stop PostgreSQL
docker compose down

# View logs
docker compose logs -f

# Remove database volume (WARNING: deletes all data)
docker compose down -v
\`\`\`

## 🔍 Prisma Studio

To visually browse and edit your database:
\`\`\`bash
npm run prisma:studio
\`\`\`
This will open Prisma Studio at `http://localhost:5555`

## 📂 Project Structure

\`\`\`
stackflow/
├── app/
│   ├── api/
│   │   ├── dashboard/
│   │   │   └── route.ts          # Dashboard statistics API
│   │   ├── products/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts      # Single product CRUD
│   │   │   │   └── stock/
│   │   │   │       └── route.ts  # Stock update API
│   │   │   └── route.ts          # Products list & create
│   │   └── warehouses/
│   │       └── route.ts          # Warehouses API
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard page
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Edit product page
│   │   ├── new/
│   │   │   └── page.tsx          # New product page
│   │   └── page.tsx              # Products list page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   └── prisma.ts                 # Prisma client instance
├── prisma/
│   ├── migrations/               # Database migrations
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script
├── docker-compose.yml            # Docker configuration
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── README.md                     # This file
\`\`\`

## 🐛 Troubleshooting

### Docker Issues
If Docker is not installed:
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Restart your computer
3. Run `docker compose up -d`

### Database Connection Issues
\`\`\`bash
# Check if PostgreSQL container is running
docker ps

# View container logs
docker compose logs postgres

# Restart container
docker compose restart
\`\`\`

### Prisma Issues
\`\`\`bash
# Reset Prisma Client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
npm run prisma:migrate
npm run prisma:seed
\`\`\`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Developed as a demonstration of modern web application development with Next.js and PostgreSQL.

---

**Happy Coding! 🚀**
