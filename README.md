# API Testing Automation with Cypress and TypeScript

Automated API testing project for the DummyJSON Products API using Cypress and TypeScript. This project covers all CRUD operations with comprehensive test coverage including edge cases, performance testing, and data validation.

## Project Structure

```
cypress/
├── e2e/api/products/
│   ├── products-get.cy.ts          # GET /products (all products)
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
│   ├── products-search.json        # Test data for search operations
│   ├── products-categories.json    # Test data for categories
│   ├── products-category-list.json # Test data for category list
│   └── products-category.json      # Test data for category operations
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
# Run all product tests
npm run test:products

# Run specific test file
npm run test:spec "cypress/e2e/api/products/products-get.cy.ts"
```

## Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## API Endpoints Tested

### GET Operations
- **GET /products** - Get all products with pagination, field selection, and sorting
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

Each endpoint includes comprehensive testing:

- ✅ Basic functionality tests
- ✅ Edge cases and boundary testing
- ✅ Error handling and invalid inputs
- ✅ Performance validation
- ✅ Data type and structure validation
- ✅ Concurrent request testing
- ✅ Security testing (SQL injection, XSS attempts)
- ✅ Response time validation

## Key Features

- **TypeScript**: Full type safety with custom interfaces
- **Custom Commands**: Reusable validation functions
- **Fixture-based Testing**: All test data centralized in JSON fixtures
- **Edge Case Coverage**: Invalid IDs, malformed data, boundary conditions
- **Performance Testing**: Response time validation under load
- **Code Quality**: ESLint + Prettier for consistent code style

## Configuration

- **Base URL**: https://dummyjson.com
- **Timeout**: 10 seconds for requests
- **Test Data**: Centralized in fixtures for maintainability
- **Code Style**: No semicolons, single quotes, consistent formatting

## Custom Commands

Reusable validation functions for common test patterns:

- `cy.validateProductResponse()` - Validate product response structure
- `cy.validateSingleProduct()` - Validate single product data
- `cy.validateProductDataTypes()` - Validate data types
- `cy.checkResponseTime()` - Check response time limits
- `cy.validatePagination()` - Validate pagination data
- `cy.validateFieldSelection()` - Validate field selection responses

## TypeScript Interfaces

Defined interfaces for type safety:

- `Product` - Complete product data structure
- `ProductsResponse` - API response structure with pagination
- `Category` - Category data structure
- `Review` - Product review structure
- `ProductSearchParams` - Search parameters interface

## Notes

- All tests use fixture data instead of hardcoded values for maintainability
- Tests focus on API behavior rather than exact data content
- Edge cases include invalid IDs, malformed data, and boundary conditions
- Performance tests validate response times under concurrent load
- Security tests include SQL injection and XSS attempt validation
- Code follows consistent formatting with ESLint and Prettier

## Dependencies

- Cypress 13.6.0
- TypeScript 5.0.0
- ESLint 8.57.1
- Prettier 3.6.2
