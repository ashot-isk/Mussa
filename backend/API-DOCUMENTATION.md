# Mussa Flower Shop - Complete Backend API Documentation

## 🌸 Overview

This is a full-featured e-commerce backend for a flower shop built with ASP.NET Core, PostgreSQL, and Entity Framework Core.

## 🔧 Tech Stack

- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Token
- **Password Hashing**: BCrypt

## 📊 Database Models

### 1. **Product**

Flower products/bouquets for sale.

```csharp
- Id (Guid)
- Name (string)
- Description (string)
- Price (decimal)
- ImageUrl (string)
- Stock (int)
- CategoryId (Guid, nullable)
- IsFeatured (bool)
- IsAvailable (bool)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
```

### 2. **Category**

Product categories (Roses, Peonies, etc.)

```csharp
- Id (Guid)
- Name (string)
- Description (string)
- ImageUrl (string)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
- Products (Collection)
```

**Seeded Categories:**

- Roses
- Peonies
- Mixed Bouquets
- Gift Boxes

### 3. **Customer**

Customer information for orders.

```csharp
- Id (Guid)
- FullName (string)
- Email (string)
- Phone (string)
- Address (string)
- City (string)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
- Orders (Collection)
```

### 4. **Order**

Customer orders with delivery details.

```csharp
- Id (Guid)
- CustomerId (Guid)
- TotalAmount (decimal)
- Status (string: Pending, Processing, Completed, Cancelled)
- DeliveryAddress (string)
- DeliveryDate (DateTime, nullable)
- DeliveryTime (string)
- Notes (string)
- PaymentMethod (string)
- IsPaid (bool)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
- Customer (Navigation)
- OrderItems (Collection)
```

### 5. **OrderItem**

Individual items in an order.

```csharp
- Id (Guid)
- OrderId (Guid)
- ProductId (Guid)
- Quantity (int)
- UnitPrice (decimal)
- Subtotal (decimal)
- Order (Navigation)
- Product (Navigation)
```

### 6. **User**

Admin/staff users for management.

```csharp
- Id (Guid)
- Username (string)
- PasswordHash (string)
- Role (string: User, Supervisor)
- CreatedAt (DateTime)
- UpdatedAt (DateTime)
```

## 🔐 API Endpoints

### **Authentication**

#### POST /api/auth/login

Login and get JWT token.

**Request:**

```json
{
  "username": "supervisor",
  "password": "supervisor"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "guid",
    "username": "supervisor",
    "role": "Supervisor"
  }
}
```

#### POST /api/auth/register

Register new user account.

**Request:**

```json
{
  "username": "newuser",
  "password": "password"
}
```

---

### **Products** (`/api/products`)

#### GET /api/products

Get all products.

**Response:**

```json
[
  {
    "id": "guid",
    "name": "Pastel Peony Dream",
    "description": "Beautiful peony bouquet",
    "price": 48000,
    "imageUrl": "/images/peony.jpg",
    "stock": 10,
    "categoryId": "guid",
    "isFeatured": true,
    "isAvailable": true,
    "createdAt": "2025-12-24T...",
    "updatedAt": "2025-12-24T..."
  }
]
```

#### GET /api/products/{id}

Get single product by ID.

#### POST /api/products

Create new product (requires Supervisor role).

**Request:**

```json
{
  "name": "Rose Bouquet",
  "description": "12 red roses",
  "price": 39000,
  "stock": 20,
  "imageUrl": ""
}
```

#### PUT /api/products/{id}

Update product (requires authentication).

#### DELETE /api/products/{id}

Delete product (requires authentication).

#### POST /api/products/{id}/upload-image

Upload product image (requires authentication).

**Form Data:**

- file: Image file

---

### **Categories** (`/api/categories`)

#### GET /api/categories

Get all categories with products.

**Response:**

```json
[
  {
    "id": "guid",
    "name": "Roses",
    "description": "Beautiful rose bouquets",
    "imageUrl": "",
    "products": []
  }
]
```

#### GET /api/categories/{id}

Get category by ID with products.

#### POST /api/categories

Create category (requires Supervisor role).

**Request:**

```json
{
  "name": "Tulips",
  "description": "Spring tulip arrangements",
  "imageUrl": ""
}
```

#### PUT /api/categories/{id}

Update category (requires Supervisor role).

#### DELETE /api/categories/{id}

Delete category (requires Supervisor role).

---

### **Orders** (`/api/orders`)

#### GET /api/orders

Get all orders (requires Supervisor role).

**Response:**

```json
[
  {
    "id": "guid",
    "customerId": "guid",
    "totalAmount": 87000,
    "status": "Pending",
    "deliveryAddress": "123 Main St",
    "deliveryDate": "2025-12-25T10:00:00Z",
    "deliveryTime": "10:00 AM - 12:00 PM",
    "notes": "Call before delivery",
    "paymentMethod": "Cash",
    "isPaid": false,
    "customer": {},
    "orderItems": []
  }
]
```

#### GET /api/orders/{id}

Get single order by ID.

#### POST /api/orders

Create new order (public endpoint).

**Request:**

```json
{
  "customer": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+374 99 123456",
    "address": "123 Main Street",
    "city": "Yerevan"
  },
  "items": [
    {
      "productId": "guid",
      "quantity": 2
    }
  ],
  "deliveryAddress": "123 Main Street, Yerevan",
  "deliveryDate": "2025-12-25T10:00:00Z",
  "deliveryTime": "10:00 AM - 12:00 PM",
  "notes": "Please call before delivery",
  "paymentMethod": "Cash"
}
```

**Response:**

```json
{
  "id": "guid",
  "customerId": "guid",
  "totalAmount": 96000,
  "status": "Pending",
  ...
}
```

#### PUT /api/orders/{id}/status

Update order status (requires Supervisor role).

**Request:**

```json
{
  "status": "Processing"
}
```

#### PUT /api/orders/{id}/payment

Mark order as paid/unpaid (requires Supervisor role).

**Request:**

```json
true
```

#### DELETE /api/orders/{id}

Cancel order and restore stock (requires Supervisor role).

---

### **Customers** (`/api/customers`)

#### GET /api/customers

Get all customers (requires Supervisor role).

#### GET /api/customers/{id}

Get customer by ID with orders (requires Supervisor role).

#### GET /api/customers/email/{email}

Get customer by email with orders (public for order tracking).

---

### **Users** (`/api/users`)

#### GET /api/users

Get all users (requires Supervisor role).

#### GET /api/users/{id}

Get user by ID (requires Supervisor role).

#### POST /api/users

Create new user (requires Supervisor role).

**Request:**

```json
{
  "username": "newuser",
  "password": "password123",
  "role": "User"
}
```

#### PUT /api/users/{id}

Update user (requires Supervisor role).

#### DELETE /api/users/{id}

Delete user (requires Supervisor role).

#### GET /api/users/profile

Get current user profile (requires authentication).

---

## 🚀 Key Features

### 1. **Inventory Management**

- Automatic stock tracking
- Stock deducted when orders placed
- Stock restored when orders cancelled

### 2. **Order Processing**

- Customer creation/update on order
- Order status tracking (Pending → Processing → Completed/Cancelled)
- Payment status tracking
- Delivery scheduling

### 3. **Category Organization**

- Products organized by categories
- Seeded with common flower categories
- Easy to add custom categories

### 4. **Image Upload**

- Product images stored in wwwroot/images
- Accessible via /images/{filename}

### 5. **Security**

- JWT authentication
- Role-based authorization (User, Supervisor)
- Supervisor-only endpoints for management
- Password hashing with BCrypt

### 6. **Customer Management**

- Automatic customer creation from orders
- Customer update if exists
- Order history tracking
- Email-based lookup

## 📝 Usage Examples

### Place an Order (Customer Flow)

```bash
# 1. Browse products
curl http://localhost:5074/api/products

# 2. View categories
curl http://localhost:5074/api/categories

# 3. Place order
curl -X POST http://localhost:5074/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "fullName": "Anna Grigoryan",
      "email": "anna@example.com",
      "phone": "+374 99 123456",
      "city": "Yerevan"
    },
    "items": [
      {"productId": "product-guid", "quantity": 1}
    ],
    "deliveryAddress": "10 Abovyan Street, Yerevan",
    "deliveryDate": "2025-12-25T14:00:00Z",
    "deliveryTime": "2:00 PM - 4:00 PM",
    "paymentMethod": "Cash"
  }'

# 4. Track order by email
curl http://localhost:5074/api/customers/email/anna@example.com
```

### Admin Management Flow

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:5074/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"supervisor","password":"supervisor"}' \
  | jq -r '.token')

# 2. View all orders
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5074/api/orders

# 3. Update order status
curl -X PUT http://localhost:5074/api/orders/{id}/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Processing"}'

# 4. Mark as paid
curl -X PUT http://localhost:5074/api/orders/{id}/payment \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d 'true'

# 5. View customers
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5074/api/customers
```

## 🗄️ Database Setup

```bash
# Create migration
dotnet ef migrations add InitialCreate

# Apply migration
dotnet ef database update

# Remove last migration (if needed)
dotnet ef migrations remove
```

## 🔑 Default Credentials

**Supervisor Account:**

- Username: `supervisor`
- Password: `supervisor`

**Database Connection:**

- Host: `localhost`
- Database: `mussa_db`
- Username: `ashot`

## 📦 Dependencies

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.4" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.4" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.4" />
```

## 🎯 Business Logic

### Order Creation

1. Validate customer email (create or update customer)
2. Validate product availability and stock
3. Create order with items
4. Calculate total amount
5. Deduct stock from products
6. Return order details

### Order Cancellation

1. Find order and items
2. Restore stock to products
3. Delete order and items

### Stock Management

- Products track available stock
- Stock decreases on order creation
- Stock increases on order cancellation
- Out-of-stock products prevent order creation

## 🌐 CORS Configuration

Currently allows all origins for development. Update for production:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", builder =>
    {
        builder.WithOrigins("https://yourproductionsite.com")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

## 📊 Sample API Responses

**Get All Products:**

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Romantic Rose Bouquet",
    "description": "12 premium red roses with greenery",
    "price": 45000,
    "imageUrl": "/images/roses_red.jpg",
    "stock": 15,
    "categoryId": "11111111-1111-1111-1111-111111111111",
    "isFeatured": true,
    "isAvailable": true,
    "createdAt": "2025-12-24T10:00:00Z",
    "updatedAt": "2025-12-24T10:00:00Z"
  }
]
```

**Order with Customer:**

```json
{
  "id": "order-guid",
  "totalAmount": 90000,
  "status": "Pending",
  "deliveryAddress": "10 Abovyan St, Yerevan",
  "deliveryDate": "2025-12-25T14:00:00Z",
  "deliveryTime": "2:00 PM - 4:00 PM",
  "customer": {
    "id": "customer-guid",
    "fullName": "Anna Grigoryan",
    "email": "anna@example.com",
    "phone": "+374 99 123456"
  },
  "orderItems": [
    {
      "id": "item-guid",
      "productId": "product-guid",
      "quantity": 2,
      "unitPrice": 45000,
      "subtotal": 90000,
      "product": {
        "name": "Romantic Rose Bouquet",
        "imageUrl": "/images/roses_red.jpg"
      }
    }
  ]
}
```

---

**Built with ❤️ for Mussa Flower Shop**
