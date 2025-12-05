# API Documentation - Inventory Management System

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

---

## 📦 Products API

### 1. Get All Products

**Endpoint:** \`GET /products\`

**Description:** Retrieve all products with optional search and filtering

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search by product name or SKU (case-insensitive) |
| warehouseId | number | No | Filter products by warehouse ID |

**Example Requests:**
\`\`\`bash
# Get all products
GET /api/products

# Search for products
GET /api/products?search=laptop

# Filter by warehouse
GET /api/products?warehouseId=1

# Combined search and filter
GET /api/products?search=mouse&warehouseId=2
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "productName": "Laptop HP ProBook 450",
      "sku": "LAP-HP-001",
      "unitPrice": "899.99",
      "quantity": 50,
      "minimumQuantity": 10,
      "maximumQuantity": 100,
      "warehouseId": 1,
      "warehouse": {
        "warehouseId": 1,
        "warehouseName": "Main Warehouse",
        "location": "123 Main Street, City, State 12345"
      }
    }
  ],
  "count": 1
}
\`\`\`

**Error Response (500):**
\`\`\`json
{
  "success": false,
  "error": "Failed to fetch products",
  "message": "Error details..."
}
\`\`\`

---

### 2. Get Single Product

**Endpoint:** \`GET /products/:id\`

**Description:** Retrieve a single product by ID

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Product ID |

**Example Request:**
\`\`\`bash
GET /api/products/1
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "productId": 1,
    "productName": "Laptop HP ProBook 450",
    "sku": "LAP-HP-001",
    "unitPrice": "899.99",
    "quantity": 50,
    "minimumQuantity": 10,
    "maximumQuantity": 100,
    "warehouseId": 1,
    "warehouse": {
      "warehouseId": 1,
      "warehouseName": "Main Warehouse",
      "location": "123 Main Street, City, State 12345"
    }
  }
}
\`\`\`

**Error Response (404):**
\`\`\`json
{
  "success": false,
  "error": "Product not found"
}
\`\`\`

---

### 3. Create Product

**Endpoint:** \`POST /products\`

**Description:** Create a new product

**Request Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productName | string | Yes | Name of the product |
| sku | string | Yes | Unique stock keeping unit code |
| unitPrice | number | Yes | Price per unit |
| quantity | number | No | Current stock quantity (default: 0) |
| minimumQuantity | number | No | Minimum stock level (default: 0) |
| maximumQuantity | number | No | Maximum stock level (default: 0) |
| warehouseId | number | No | ID of the warehouse |

**Example Request:**
\`\`\`bash
POST /api/products
Content-Type: application/json

{
  "productName": "Wireless Mouse Logitech",
  "sku": "MOUSE-LOG-002",
  "unitPrice": 35.99,
  "quantity": 150,
  "minimumQuantity": 30,
  "maximumQuantity": 300,
  "warehouseId": 2
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "success": true,
  "data": {
    "productId": 11,
    "productName": "Wireless Mouse Logitech",
    "sku": "MOUSE-LOG-002",
    "unitPrice": "35.99",
    "quantity": 150,
    "minimumQuantity": 30,
    "maximumQuantity": 300,
    "warehouseId": 2,
    "warehouse": {
      "warehouseId": 2,
      "warehouseName": "Secondary Warehouse",
      "location": "456 Oak Avenue, City, State 12345"
    }
  },
  "message": "Product created successfully"
}
\`\`\`

**Error Responses:**

**400 Bad Request:**
\`\`\`json
{
  "success": false,
  "error": "Product name, SKU, and price are required"
}
\`\`\`

**409 Conflict:**
\`\`\`json
{
  "success": false,
  "error": "Product with this SKU already exists"
}
\`\`\`

---

### 4. Update Product

**Endpoint:** \`PUT /products/:id\`

**Description:** Update an existing product

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Product ID |

**Request Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Request Body (all fields optional):**
| Field | Type | Description |
|-------|------|-------------|
| productName | string | Name of the product |
| sku | string | Stock keeping unit code |
| unitPrice | number | Price per unit |
| quantity | number | Current stock quantity |
| minimumQuantity | number | Minimum stock level |
| maximumQuantity | number | Maximum stock level |
| warehouseId | number | ID of the warehouse |

**Example Request:**
\`\`\`bash
PUT /api/products/11
Content-Type: application/json

{
  "productName": "Wireless Mouse Logitech MX Master",
  "unitPrice": 99.99,
  "quantity": 75
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "productId": 11,
    "productName": "Wireless Mouse Logitech MX Master",
    "sku": "MOUSE-LOG-002",
    "unitPrice": "99.99",
    "quantity": 75,
    "minimumQuantity": 30,
    "maximumQuantity": 300,
    "warehouseId": 2,
    "warehouse": {...}
  },
  "message": "Product updated successfully"
}
\`\`\`

**Error Responses:**

**404 Not Found:**
\`\`\`json
{
  "success": false,
  "error": "Product not found"
}
\`\`\`

**409 Conflict:**
\`\`\`json
{
  "success": false,
  "error": "Product with this SKU already exists"
}
\`\`\`

---

### 5. Delete Product

**Endpoint:** \`DELETE /products/:id\`

**Description:** Delete a product

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Product ID |

**Example Request:**
\`\`\`bash
DELETE /api/products/11
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Product deleted successfully"
}
\`\`\`

**Error Response (404):**
\`\`\`json
{
  "success": false,
  "error": "Product not found"
}
\`\`\`

---

### 6. Update Stock Quantity

**Endpoint:** \`PATCH /products/:id/stock\`

**Description:** Add or remove stock from a product

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Product ID |

**Request Headers:**
\`\`\`
Content-Type: application/json
\`\`\`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | number | Yes | Amount to add or remove |
| type | string | Yes | "add" or "remove" |

**Example Request (Add Stock):**
\`\`\`bash
PATCH /api/products/1/stock
Content-Type: application/json

{
  "quantity": 20,
  "type": "add"
}
\`\`\`

**Example Request (Remove Stock):**
\`\`\`bash
PATCH /api/products/1/stock
Content-Type: application/json

{
  "quantity": 5,
  "type": "remove"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "productId": 1,
    "productName": "Laptop HP ProBook 450",
    "sku": "LAP-HP-001",
    "unitPrice": "899.99",
    "quantity": 70,
    "minimumQuantity": 10,
    "maximumQuantity": 100,
    "warehouseId": 1,
    "warehouse": {...}
  },
  "message": "Stock added successfully"
}
\`\`\`

**Error Responses:**

**400 Bad Request:**
\`\`\`json
{
  "success": false,
  "error": "Quantity and type (add/remove) are required"
}
\`\`\`

**400 Bad Request (Insufficient Stock):**
\`\`\`json
{
  "success": false,
  "error": "Insufficient stock quantity"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "success": false,
  "error": "Product not found"
}
\`\`\`

---

## 📊 Dashboard API

### Get Dashboard Statistics

**Endpoint:** \`GET /dashboard\`

**Description:** Get comprehensive dashboard statistics including inventory value, product counts, and alerts

**Example Request:**
\`\`\`bash
GET /api/dashboard
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "totalProducts": 10,
    "totalInventoryValue": "123456.78",
    "totalStockQuantity": 1055,
    "lowStockCount": 2,
    "lowStockProducts": [
      {
        "productId": 8,
        "productName": "External SSD 1TB",
        "sku": "SSD-EXT-001",
        "quantity": 8,
        "minimumQuantity": 10,
        "warehouse": {...}
      }
    ],
    "productsByWarehouse": [
      {
        "warehouseId": 1,
        "warehouseName": "Main Warehouse",
        "_count": {
          "products": 6
        }
      },
      {
        "warehouseId": 2,
        "warehouseName": "Secondary Warehouse",
        "_count": {
          "products": 4
        }
      }
    ],
    "recentStockMovements": [
      {
        "movementId": 15,
        "productId": 1,
        "quantity": 20,
        "type": "IN",
        "reference": "Manual addition",
        "userId": null,
        "createdAt": "2025-12-04T10:30:00.000Z",
        "product": {
          "productId": 1,
          "productName": "Laptop HP ProBook 450",
          "sku": "LAP-HP-001"
        }
      }
    ]
  }
}
\`\`\`

**Error Response (500):**
\`\`\`json
{
  "success": false,
  "error": "Failed to fetch dashboard statistics",
  "message": "Error details..."
}
\`\`\`

---

## 🏢 Warehouses API

### Get All Warehouses

**Endpoint:** \`GET /warehouses\`

**Description:** Retrieve all warehouses with product counts

**Example Request:**
\`\`\`bash
GET /api/warehouses
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "warehouseId": 1,
      "warehouseName": "Main Warehouse",
      "location": "123 Main Street, City, State 12345",
      "_count": {
        "products": 6
      }
    },
    {
      "warehouseId": 2,
      "warehouseName": "Secondary Warehouse",
      "location": "456 Oak Avenue, City, State 12345",
      "_count": {
        "products": 4
      }
    }
  ]
}
\`\`\`

**Error Response (500):**
\`\`\`json
{
  "success": false,
  "error": "Failed to fetch warehouses",
  "message": "Error details..."
}
\`\`\`

---

## 📋 HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Request completed successfully |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (duplicate SKU) |
| 500 | Internal Server Error - Server-side error |

---

## 🔐 Error Response Format

All error responses follow this structure:
\`\`\`json
{
  "success": false,
  "error": "Human readable error message",
  "message": "Technical error details (optional)"
}
\`\`\`

---

## 📝 Notes

1. **SKU Uniqueness**: Each product must have a unique SKU code
2. **Stock Operations**: Stock movements are automatically tracked in the \`stock_movements\` table
3. **Cascading Deletes**: Deleting a product will cascade delete related purchases, sales, and stock movements
4. **Decimal Precision**: Prices are stored with 2 decimal precision
5. **Timestamps**: All timestamps are in ISO 8601 format (UTC)

---

## 🧪 Postman Collection Variables

Set these variables in your Postman environment:

\`\`\`
baseUrl: http://localhost:3000
apiUrl: {{baseUrl}}/api
\`\`\`

Then use:
- \`{{apiUrl}}/products\`
- \`{{apiUrl}}/dashboard\`
- \`{{apiUrl}}/warehouses\`

---

**Last Updated:** December 4, 2025
