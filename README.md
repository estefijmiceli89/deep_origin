# API Testing with Cypress and TypeScript

This project contains automated API tests for the DummyJSON Products API using Cypress and TypeScript.

## Project Structure

```
cypress/
├── e2e/
│   └── api/
│       └── products/
│           ├── products-get.cy.ts
│           ├── products-post.cy.ts
│           ├── products-put.cy.ts
│           ├── products-delete.cy.ts
│           └── products-search.cy.ts
├── fixtures/
│   └── products/
│       ├── product-data.json
│       └── product-update-data.json
└── support/
    ├── e2e.ts
    ├── commands.ts
    └── types.ts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Open Cypress:
```bash
npm run cypress:open
```

## Available Scripts

- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run tests in headless mode
- `npm run test:api` - Run all API tests
- `npm run test:products` - Run only products API tests
- `npm run test:headless` - Run tests in headless mode
- `npm run test:headed` - Run tests in headed mode

## API Endpoints Covered

- **GET /products** - Get all products with pagination
- **GET /products/{id}** - Get single product
- **POST /products/add** - Add new product
- **PUT /products/{id}** - Update product
- **DELETE /products/{id}** - Delete product
- **GET /products/search** - Search products
- **GET /products/categories** - Get product categories

## Custom Commands

- `cy.validateProductResponse(response)` - Validate product response structure
- `cy.validateSingleProduct(product)` - Validate single product structure
- `cy.validateProductsArray(products)` - Validate products array
- `cy.checkResponseTime(response, maxTime)` - Check response time

## TypeScript Interfaces

The project includes TypeScript interfaces for:
- `Product` - Product object structure
- `ProductsResponse` - Response for multiple products
- `SingleProductResponse` - Response for single product
- `Category` - Category object structure
- `ProductSearchParams` - Search parameters

## Best Practices Applied

- **Type Safety**: Full TypeScript support with interfaces
- **Reusability**: Custom commands and helpers
- **Maintainability**: Organized folder structure
- **Readability**: Clear test descriptions and structure
- **Performance**: Response time validation
- **Data Management**: Fixtures for test data 