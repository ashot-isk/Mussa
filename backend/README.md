# Mussa API

A .NET 8 ASP.NET Core Web API for managing products with PostgreSQL database.

## Features

- CRUD operations for Products
- PostgreSQL database with Entity Framework Core
- Swagger/OpenAPI documentation
- CORS enabled for frontend integration

## Prerequisites

- .NET 8.0 SDK
- PostgreSQL

## Setup

1. Ensure PostgreSQL is running and create the database:

   ```bash
   createdb mussa_db
   ```

2. Update the connection string in `appsettings.json` if needed:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=mussa_db;Username=yourusername"
     }
   }
   ```

3. Run database migrations:

   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5074`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

### Swagger Documentation

When running in development mode, visit `http://localhost:5074/swagger` for API documentation.

## Product Model

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "imageUrl": "https://example.com/image.jpg",
  "stock": 100,
  "createdAt": "2025-12-21T19:09:06.000Z",
  "updatedAt": "2025-12-21T19:09:06.000Z"
}
```

## Development

To add more entities or modify the API:

1. Create models in `Models/` folder
2. Add DbSet to `ApplicationDbContext`
3. Create controller in `Controllers/` folder
4. Create migration: `dotnet ef migrations add MigrationName`
5. Update database: `dotnet ef database update`
