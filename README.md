# API Testing Automation with Cypress and TypeScript

This project contains automated API tests for the DummyJSON Products API using Cypress and TypeScript.

## Project Structure

```
cypress/
├── e2e/api/products/
│   ├── products-get.cy.ts          # GET /products (all products)
│   ├── products-single.cy.ts       # GET /products/{id} (single product)
│   ├── products-search.cy.ts       # GET /products/search (search products)
│   ├── products-categories.cy.ts   # GET /products/categories (all categories)
│   ├── products-category-list.cy.ts # GET /products/category-list (category list)
│   ├── products-category.cy.ts     # GET /products/category/{category}
│   ├── products-post.cy.ts         # POST /products/add (add product)
│   ├── products-put.cy.ts          # PUT /products/{id} (update product)
│   └── products-delete.cy.ts       # DELETE /products/{id} (delete product)
├── fixtures/test-data/
│   ├── products-get.json           # Test data for GET operations
│   ├── products-post.json          # Test data for POST operations
│   ├── products-put.json           # Test data for PUT operations
│   ├── products-delete.json        # Test data for DELETE operations
│   └── products-search.json        # Test data for search operations
├── support/
│   ├── commands.ts                 # Custom Cypress commands
│   ├── config.ts                   # API configuration
│   ├── types.ts                    # TypeScript interfaces
│   └── e2e.ts                      # Global declarations
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
# Run all tests
npm run test

# Run specific test file
npm run test:spec cypress/e2e/api/products/products-get.cy.ts

# Run tests in headless mode
npm run test:headless

# Open Cypress UI
npm run cypress:open
```

## API Endpoints Tested

### GET Operations
- **GET /products** - Get all products with pagination, field selection, and sorting
- **GET /products/{id}** - Get single product by ID
- **GET /products/search** - Search products by query
- **GET /products/categories** - Get all product categories
- **GET /products/category-list** - Get category list
- **GET /products/category/{category}** - Get products by category

### POST Operations
- **POST /products/add** - Add new product

### PUT Operations
- **PUT /products/{id}** - Update existing product

### DELETE Operations
- **DELETE /products/{id}** - Delete product (returns deleted product with isDeleted flag)

## Test Coverage

Each endpoint includes:
- Basic functionality tests
- Edge cases and boundary testing
- Error handling
- Performance validation
- Data type validation
- Response structure validation

## Configuration

- **Base URL**: https://dummyjson.com
- **Timeout**: 10 seconds for requests
- **Test Data**: Centralized in fixtures for maintainability

## Custom Commands

The project uses custom Cypress commands for common validations:
- `cy.validateProductResponse()` - Validate product response structure
- `cy.validateSingleProduct()` - Validate single product data
- `cy.validateProductDataTypes()` - Validate data types
- `cy.checkResponseTime()` - Check response time limits

## TypeScript Interfaces

Defined interfaces for type safety:
- `Product` - Product data structure
- `ProductsResponse` - API response structure
- `Category` - Category data structure

## Notes

- All tests use fixture data instead of hardcoded values
- Tests focus on API behavior rather than exact data content
- Edge cases include invalid IDs, malformed data, and boundary conditions
- Performance tests validate response times under load 