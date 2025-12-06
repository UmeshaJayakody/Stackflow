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
- **Docker Compose**: Version 2.x or higher

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

## Database Setup with Docker

The application uses PostgreSQL running in a Docker container for simplified setup and portability.

### 1. Start PostgreSQL Container

```bash
docker-compose up -d
```

This command will:
- Pull the PostgreSQL 16 Alpine image
- Create a container named `inventory_postgres`
- Expose PostgreSQL on port 5432
- Create a persistent volume for data storage

### 2. Verify Container is Running

```bash
docker ps
```

### 3. Run Database Migrations

Initialize the database schema using Prisma:

```bash
npx prisma migrate deploy
```

### 4. Seed the Database (Optional)

Populate the database with initial data:

```bash
npx prisma db seed
```

This creates default admin user (admin@example.com / admin123) and sample data.

### Database Management Commands

- **Stop the database:**
  ```bash
  docker-compose stop
  ```

- **Start the database:**
  ```bash
  docker-compose start
  ```

- **Remove the database container:**
  ```bash
  docker-compose down
  ```

- **Access PostgreSQL CLI:**
  ```bash
  docker exec -it inventory_postgres psql -U inventory_user -d inventory_db
  ```

- **Prisma Studio (Database GUI):**
  ```bash
  npx prisma studio
  ```

## Environment Configuration

Create a `.env` file in the project root:

```env
# Database Connection
DATABASE_URL="postgresql://inventory_user:inventory_pass@localhost:5432/inventory_db"

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

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
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

#### DELETE /api/users/[id]
Delete a user by ID.

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
