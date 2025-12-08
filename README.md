# Inventory Management System

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Database Setup with Docker](#database-setup-with-docker)
8. [Environment Configuration](#environment-configuration)
9. [Running the Application](#running-the-application)
10. [API Documentation](#api-documentation)
11. [User Guide](#user-guide)
12. [Project Structure](#project-structure)
13. [Contributing](#contributing)
14. [License](#license)

## Overview

The Inventory Management System is a comprehensive, full-stack web application designed for businesses to efficiently manage their inventory, track stock movements, record sales and purchases, and generate detailed reports. Built with Next.js 16 and PostgreSQL, this system provides real-time inventory tracking with FIFO (First-In-First-Out) valuation methodology, multi-warehouse support, and complete audit trails.

This enterprise-grade solution features role-based access control, automated stock calculations, customer and supplier management, and extensive reporting capabilities including profit/loss analysis, sales trends, and purchase history.

## Features

### Core Features

- **Product Management**: Create, edit, and delete products with SKU generation, categorization, barcode/QR code support, and multi-warehouse stock tracking
- **Purchase Management**: Record supplier purchases with automatic stock batch creation and FIFO cost tracking
- **Sales Management**: Process customer sales with automatic FIFO cost calculation and stock deduction
- **Multi-Warehouse Support**: Track inventory across multiple warehouse locations with real-time stock levels
- **Stock Movement Tracking**: Complete audit trail of all inventory movements with timestamps and user attribution
- **Customer & Supplier Management**: Maintain detailed records of business partners with contact information and transaction history
- **User Management**: Role-based access control with admin privileges for system configuration
- **Activity Logging**: Comprehensive logging of all system activities for compliance and troubleshooting
- **Password Management**: Secure password reset functionality with email verification
- **QR Code Generation**: Generate QR codes for products to facilitate barcode scanning

### Technical Features

- **FIFO Inventory Valuation**: Accurate cost of goods sold calculation using First-In-First-Out methodology
- **Real-time Stock Updates**: Immediate inventory updates across all warehouses upon transactions
- **Data Validation**: Comprehensive input validation to ensure data integrity
- **Responsive Design**: Mobile-friendly interface accessible on all devices
- **API-First Architecture**: RESTful API endpoints for integration with external systems
- **Database Transactions**: ACID-compliant database operations for data consistency
- **Email Notifications**: Automated email alerts for password resets and system notifications
- **Low Stock Alerts**: Automatic notifications when product quantities fall below minimum thresholds
- **Batch Stock Tracking**: Detailed tracking of stock batches with expiration dates and lot numbers

### Reporting Features

- **Sales Reports**: Detailed sales analysis by date range, customer, and product
- **Purchase Reports**: Purchase history with supplier and date filtering
- **Profit & Loss Reports**: Financial analysis with gross profit calculations
- **Product Reports**: Inventory valuation, stock levels, and movement history
- **Supplier Reports**: Supplier performance and purchase analytics
- **Customer Reports**: Customer purchase history and revenue analysis
- **User Activity Reports**: System usage and user action tracking
- **Daily Profit/Loss Bar Chart**: Visual representation of daily profitability trends

## Technology Stack

### Frontend

- **Next.js 16.0.7**: React framework with App Router and Turbopack for fast development
- **React 19.2.0**: Modern UI library with hooks and concurrent features
- **TypeScript 5.x**: Static type checking for enhanced code quality
- **Tailwind CSS 3.4.1**: Utility-first CSS framework for responsive design
- **Recharts 2.15.0**: Data visualization library for charts and graphs
- **React Hook Form**: Form state management and validation
- **Lucide React**: Icon library for consistent UI elements

### Backend

- **Next.js API Routes**: Serverless API endpoints built into Next.js
- **Prisma 6.19.0**: Next-generation ORM for type-safe database access
- **PostgreSQL 16**: Advanced open-source relational database
- **bcrypt 5.1.1**: Password hashing for secure authentication
- **Nodemailer 6.9.17**: Email sending for password resets and notifications
- **QRCode 1.5.4**: QR code generation for product labeling

### DevOps & Tools

- **Docker & Docker Compose**: Containerization for PostgreSQL database
- **ESLint**: Code linting for JavaScript/TypeScript
- **PostCSS**: CSS transformation and optimization
- **XLSX 0.18.5**: Excel file generation for report exports

## System Architecture

The application follows a modern three-tier architecture with client layer (Next.js frontend), application layer (API routes), and data layer (PostgreSQL database).

### Database Schema

The system uses 10 interconnected tables:

1. **User**: System users with authentication credentials and role management
2. **Warehouse**: Physical locations for inventory storage
3. **Supplier**: Vendors from whom products are purchased
4. **Customer**: Buyers of products
5. **Product**: Items in inventory with SKU, pricing, and stock thresholds
6. **Purchase**: Purchase transactions from suppliers
7. **Sale**: Sales transactions to customers
8. **StockMovement**: Historical record of all stock changes
9. **StockBatch**: FIFO cost tracking with batch-level inventory management
10. **ActivityLog**: System-wide audit trail of user actions

## Prerequisites

Before installing the application, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Docker**: Version 20.x or higher
- **PostgreSQL**: Version 14+ (if not using Docker)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stackflow
```

### 2. Install Dependencies

```bash
npm install
```

## Database Setup

You can set up PostgreSQL either using Docker (recommended) or as a native installation on your system.

### Option A: Docker Setup (Recommended)

#### For Ubuntu/Linux

**1. Install Docker and Docker Compose**

```bash
# Update package index
sudo apt update

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to the docker group (to run without sudo)
sudo usermod -aG docker $USER

# Apply group changes (or log out and back in)
newgrp docker
```

**2. Start PostgreSQL Container**

```bash
# Remove any existing container with the same name
sudo docker rm -f mypostgresql 2>/dev/null || true

# Start PostgreSQL container
sudo docker run --name mypostgresql \
  -e POSTGRES_USER=inventory_user \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=inventory_db \
  -p 5433:5432 \
  -d postgres

# Verify container is running
sudo docker ps
```

**3. Create PostgREST Role (for REST API access)**

```bash
sudo docker exec -i mypostgresql psql -U inventory_user -d inventory_db <<'EOF'
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web_anon;
EOF
```

**4. Start PostgREST (Optional - for REST API)**

```bash
# Start PostgREST using docker-compose
sudo docker compose up -d
```

#### For Windows

**1. Install Docker Desktop**

- Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
- Run the installer and follow the setup wizard
- Enable WSL 2 backend when prompted
- Restart your computer if required
- Start Docker Desktop from the Start menu

**2. Open PowerShell or Command Prompt and verify Docker**

```powershell
docker --version
docker compose version
```

**3. Start PostgreSQL Container**

```powershell
# Remove any existing container with the same name
docker rm -f mypostgresql 2>$null

# Start PostgreSQL container
docker run --name mypostgresql `
  -e POSTGRES_USER=inventory_user `
  -e POSTGRES_PASSWORD=1234 `
  -e POSTGRES_DB=inventory_db `
  -p 5433:5432 `
  -d postgres

# Verify container is running
docker ps
```

**4. Create PostgREST Role (for REST API access)**

```powershell
docker exec -i mypostgresql psql -U inventory_user -d inventory_db
```

Then in the PostgreSQL prompt, run:

```sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'web_anon') THEN
        CREATE ROLE web_anon NOLOGIN;
    END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web_anon;
\q
```

**5. Start PostgREST (Optional - for REST API)**

```powershell
docker compose up -d
```

### Option B: Native PostgreSQL Installation

#### For Ubuntu/Linux

```bash
# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE USER inventory_user WITH PASSWORD '1234';
CREATE DATABASE inventory_db OWNER inventory_user;
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
EOF
```

Update your `.env` file to use:
```env
DATABASE_URL="postgresql://inventory_user:1234@localhost:5432/inventory_db?schema=public"
```

#### For Windows

1. Download PostgreSQL installer from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Set a password for the `postgres` user during installation
4. Use pgAdmin (installed with PostgreSQL) or psql to create the database:

```sql
CREATE USER inventory_user WITH PASSWORD '1234';
CREATE DATABASE inventory_db OWNER inventory_user;
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
```

Update your `.env` file to use:
```env
DATABASE_URL="postgresql://inventory_user:1234@localhost:5432/inventory_db?schema=public"
```

### Initialize Database

After setting up PostgreSQL (Docker or native), run these commands:

**1. Generate Prisma Client**

```bash
npx prisma generate
```

**2. Run Database Migrations**

```bash
npx prisma migrate deploy
```

**3. Seed the Database (Optional)**

```bash
npx prisma db seed
```

This creates a default admin user:
- Email: `admin@example.com`
- Password: `admin123`

### Database Management Commands

**Docker Commands:**

```bash
# Start PostgreSQL
sudo docker start mypostgresql

# Stop PostgreSQL
sudo docker stop mypostgresql

# View logs
sudo docker logs mypostgresql

# Access PostgreSQL CLI
sudo docker exec -it mypostgresql psql -U inventory_user -d inventory_db

# Remove container (WARNING: deletes data)
sudo docker rm -f mypostgresql
```

**Native PostgreSQL (Ubuntu):**

```bash
# Start/Stop service
sudo systemctl start postgresql
sudo systemctl stop postgresql

# Access PostgreSQL CLI
sudo -u postgres psql -d inventory_db
```

**Native PostgreSQL (Windows):**

Use pgAdmin GUI or:
```powershell
psql -U inventory_user -d inventory_db
```

**Prisma Studio (Database GUI) - All Platforms:**

```bash
npx prisma studio
```

## Environment Configuration

Create a `.env` file in the project root directory.

### For Ubuntu/Linux

```bash
# Create .env file
nano .env
# or
vim .env
# or use any text editor
```

### For Windows

```powershell
# Create .env file using Notepad
notepad .env
# or use VS Code, any text editor
```

### Environment Variables

Add the following to your `.env` file:

```env
# Database Connection
# For Docker setup (port 5433):
DATABASE_URL="postgresql://inventory_user:1234@localhost:5433/inventory_db?schema=public"

# For native PostgreSQL (port 5432):
# DATABASE_URL="postgresql://inventory_user:1234@localhost:5432/inventory_db?schema=public"

# Application Settings
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email Configuration (for password reset)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Inventory System <your-email@gmail.com>"

# Session Secret
SESSION_SECRET="your-random-secret-key-change-this-in-production"
```

**Important Notes:**
- For Docker setup: Use port `5433` (as shown above)
- For native PostgreSQL: Use port `5432`
- Update email settings with your actual SMTP credentials
- Change `SESSION_SECRET` to a secure random string in production

## Running the Application

### Development Mode

**Ubuntu/Linux:**
```bash
npm run dev
```

**Windows (PowerShell/CMD):**
```powershell
npm run dev
```

The application will be available at: `http://localhost:3000`

### Production Build

**Ubuntu/Linux:**
```bash
npm run build
npm start
```

**Windows (PowerShell/CMD):**
```powershell
npm run build
npm start
```

## PostgREST API Access

If you've set up PostgREST (optional), you can access your database via REST API at `http://localhost:3001`

### Testing PostgREST Endpoints

**Ubuntu/Linux:**
```bash
# View all available tables/endpoints
curl http://localhost:3001/

# Query users table
curl http://localhost:3001/users

# Query products table
curl http://localhost:3001/products

# Query with filters
curl "http://localhost:3001/products?category=eq.Electronics"

# Insert a new record
curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -d '{"product_name":"New Product","sku":"PROD-001","unit_price":99.99}'
```

**Windows (PowerShell):**
```powershell
# View all available tables/endpoints
Invoke-WebRequest -Uri http://localhost:3001/

# Query users table
Invoke-WebRequest -Uri http://localhost:3001/users

# Query products table
Invoke-WebRequest -Uri http://localhost:3001/products

# Query with filters
Invoke-WebRequest -Uri "http://localhost:3001/products?category=eq.Electronics"

# Insert a new record
$body = @{
    product_name = "New Product"
    sku = "PROD-001"
    unit_price = 99.99
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3001/products `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Using a Web Browser:**
- Simply navigate to: `http://localhost:3001/users`
- Or use tools like Postman, Insomnia, or Thunder Client (VS Code extension)

### PostgREST Container Management

**Ubuntu/Linux:**
```bash
# View PostgREST logs
sudo docker logs inventory_postgrest

# Restart PostgREST
sudo docker restart inventory_postgrest

# Stop PostgREST
sudo docker stop inventory_postgrest

# Start PostgREST
sudo docker start inventory_postgrest
```

**Windows (PowerShell):**
```powershell
# View PostgREST logs
docker logs inventory_postgrest

# Restart PostgREST
docker restart inventory_postgrest

# Stop PostgREST
docker stop inventory_postgrest

# Start PostgREST
docker start inventory_postgrest
```

## API Documentation

The application provides a comprehensive RESTful API. All endpoints return responses in the format:

```json
{
  "success": true|false,
  "data": {...},
  "error": "error message"
}
```

### Authentication Endpoints

#### POST /api/auth/login
Authenticate a user.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

#### POST /api/auth/forgot-password
Request a password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/auth/reset-password
Reset password using token.

**Request:**
```json
{
  "token": "reset-token",
  "password": "newPassword123"
}
```

### User Endpoints

#### GET /api/users
Retrieve all users.

#### POST /api/users
Create a new user (Admin only).

**Request:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "password123",
  "role": "USER"
}
```

#### GET /api/users/[id]
Retrieve a specific user by ID.

#### PUT /api/users/[id]
Update a user by ID (Admin only).

#### DELETE /api/users/[id]
Delete a user by ID.

#### POST /api/users/reset-password
Reset another user's password (Admin only).

**Request:**
```json
{
  "userId": 2,
  "newPassword": "newPassword123"
}
```

#### POST /api/users/change-password
Change current user's password.

**Request:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

### Product Endpoints

#### GET /api/products
Retrieve all products with optional filtering.

**Query Parameters:**
- `warehouseId`: Filter by warehouse
- `supplierId`: Filter by supplier
- `category`: Filter by category
- `lowStock`: Show only low stock products

#### POST /api/products
Create a new product.

**Request:**
```json
{
  "name": "New Product",
  "sku": "PROD-002",
  "category": "Electronics",
  "barcode": "0987654321",
  "buyingPrice": 80.00,
  "sellingPrice": 120.00,
  "quantity": 30,
  "minQuantity": 5,
  "maxQuantity": 50,
  "supplierId": 1,
  "warehouseId": 1
}
```

#### GET /api/products/[id]
Retrieve a single product by ID.

#### PUT /api/products/[id]
Update a product.

#### DELETE /api/products/[id]
Delete a product.

#### GET /api/products/[id]/stock
Retrieve current stock level for a product.

#### GET /api/products/[id]/stock-trend
Get stock trend data for charting.

**Query Parameters:**
- `days` (default: 30): Number of days

### Purchase Endpoints

#### GET /api/purchases
Retrieve all purchases with optional filtering.

**Query Parameters:**
- `supplierId`: Filter by supplier
- `startDate`: Filter from date
- `endDate`: Filter to date

#### POST /api/purchases
Record a new purchase.

**Request:**
```json
{
  "productId": 1,
  "supplierId": 1,
  "quantity": 20,
  "unitPrice": 100.00,
  "totalPrice": 2000.00,
  "purchaseDate": "2024-01-15"
}
```

**Side Effects:**
- Creates stock batch for FIFO tracking
- Increases product quantity
- Creates stock movement record
- Logs activity

### Sales Endpoints

#### GET /api/sales
Retrieve all sales with optional filtering.

**Query Parameters:**
- `customerId`: Filter by customer
- `startDate`: Filter from date
- `endDate`: Filter to date

#### POST /api/sales
Record a new sale.

**Request:**
```json
{
  "productId": 1,
  "customerId": 1,
  "quantity": 5,
  "unitPrice": 150.00,
  "totalPrice": 750.00,
  "saleDate": "2024-01-20"
}
```

**Side Effects:**
- Calculates COGS using FIFO
- Decreases product quantity
- Updates stock batches
- Creates stock movement record
- Logs activity

### Warehouse Endpoints

#### GET /api/warehouses
Retrieve all warehouses.

#### POST /api/warehouses
Create a new warehouse.

**Request:**
```json
{
  "name": "Secondary Warehouse",
  "location": "456 Second Ave",
  "capacity": 5000
}
```

#### GET /api/warehouses/[id]
Retrieve a specific warehouse by ID.

#### PUT /api/warehouses/[id]
Update a warehouse.

#### DELETE /api/warehouses/[id]
Delete a warehouse.

### Supplier Endpoints

#### GET /api/suppliers
Retrieve all suppliers.

#### POST /api/suppliers
Create a new supplier.

**Request:**
```json
{
  "name": "New Supplier",
  "contact": "Jane Smith",
  "email": "contact@supplier.com",
  "phone": "098-765-4321",
  "address": "321 Vendor St"
}
```

### Customer Endpoints

#### GET /api/customers
Retrieve all customers.

#### POST /api/customers
Create a new customer.

**Request:**
```json
{
  "name": "New Customer",
  "email": "customer@example.com",
  "phone": "444-555-6666",
  "address": "789 Buyer Blvd"
}
```

### Stock Batch Endpoints

#### GET /api/stock-batches
Retrieve stock batches for FIFO tracking.

**Query Parameters:**
- `productId` (required): Product ID

### Dashboard Endpoints

#### GET /api/dashboard
Retrieve dashboard statistics.

**Response includes:**
- Total products
- Total sales
- Total purchases
- Total profit
- Low stock products
- Recent sales
- Top products

### Documentation Endpoints

#### GET /api/documentation
Retrieve API documentation and system information.

### Support Endpoints

#### GET /api/support
Retrieve support information and contact details.

### Report Endpoints

#### GET /api/reports/sales
Generate sales report.

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `customerId`: Customer filter
- `productId`: Product filter

#### GET /api/reports/purchases
Generate purchase report.

**Query Parameters:**
- `startDate`: Start date
- `endDate`: End date
- `supplierId`: Supplier filter
- `productId`: Product filter

#### GET /api/reports/profit-loss
Generate profit and loss report.

**Query Parameters:**
- `days` (default: 30): Number of days

#### GET /api/reports/products
Generate product inventory report.

#### GET /api/reports/suppliers
Generate supplier performance report.

#### GET /api/reports/customers
Generate customer analytics report.

#### GET /api/reports/users
Generate user activity report.

### Activity Log Endpoints

#### GET /api/logs
Retrieve activity logs with pagination.

**Query Parameters:**
- `page` (default: 1): Page number
- `limit` (default: 50): Items per page
- `userId`: Filter by user
- `entity`: Filter by entity type
- `action`: Filter by action (CREATE, UPDATE, DELETE)

## User Guide

### Getting Started

Access the application at `http://localhost:3000` using default credentials:
- **Email:** admin@example.com
- **Password:** admin123

Change the admin password immediately after first login.

### Managing Products

1. Navigate to Products page
2. Click Add Product button
3. Fill in product details (name, SKU, prices, quantities)
4. Select supplier and warehouse
5. Click Save

**Editing:** Click Edit icon next to product, modify fields, click Update

**Deleting:** Click Delete icon, confirm deletion

**Filtering:** Use warehouse, supplier, category, or low stock filters

**QR Codes:** Click QR Code button to generate printable codes

### Recording Purchases

1. Navigate to Purchases page
2. Click Add Purchase
3. Select product and supplier
4. Enter quantity and unit price
5. Click Save

Automatically creates stock batch and increases inventory.

### Recording Sales

1. Navigate to Sales page
2. Click Add Sale
3. Select product and customer
4. Enter quantity and selling price
5. Click Save

Automatically calculates COGS using FIFO and decreases inventory.

### Managing Warehouses

1. Navigate to Warehouses page
2. Click Add Warehouse
3. Enter name, location, and capacity
4. Click Save

### Managing Suppliers

1. Navigate to Suppliers page
2. Click Add Supplier
3. Enter company details and contact information
4. Click Save

### Managing Customers

1. Navigate to Customers page
2. Click Add Customer
3. Enter customer details
4. Click Save

### Generating Reports

1. Go to Reports page
2. Select report type (Sales, Purchases, Profit & Loss, etc.)
3. Choose filters and date range
4. Click Generate Report
5. Export to Excel if needed

### User Management (Admin Only)

1. Navigate to Users page
2. Click Add User
3. Enter name, email, password, and role (USER or ADMIN)
4. Click Save

### Activity Logs

1. Navigate to Logs page
2. View comprehensive activity log
3. Filter by user, entity type, or action
4. Use pagination for large datasets

### Password Reset

**User-Initiated:**
1. Click "Forgot Password" on login page
2. Enter email address
3. Check email for reset link
4. Click link and enter new password

## Project Structure

```
stackflow/
 app/                      # Next.js App Router
    api/                  # API endpoints
       auth/             # Authentication
       products/         # Product CRUD
       purchases/        # Purchase operations
       sales/            # Sales operations
       warehouses/       # Warehouse management
       suppliers/        # Supplier management
       customers/        # Customer management
       reports/          # Report generation
       logs/             # Activity logs
       dashboard/        # Dashboard stats
    components/           # React components
    context/              # React Context
    (pages)/              # Application pages
 lib/                      # Utilities
    prisma.ts             # Prisma client
    emailService.ts       # Email service
    activityLogger.ts     # Activity logging
 prisma/                   # Database
    schema.prisma         # Schema definition
    migrations/           # Migration history
    seed.ts               # Database seeding
 docker-compose.yml        # PostgreSQL container
 package.json              # Dependencies
 .env                      # Environment variables
```

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper type annotations
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use TypeScript for all code
- Follow ESLint rules
- Add JSDoc comments for functions
- Use consistent API response format

## License

This project is licensed under the MIT License.

---

For questions or issues, please open an issue on the GitHub repository.
