# Custom Commands Documentation

This document describes the custom commands available for API testing in this project.

## Available Custom Commands

### `cy.validateProductResponse(response)`
Validates the basic structure of a products API response.

**Parameters:**
- `response`: `Cypress.Response<ProductsResponse>` - The API response object with typed body

**Validates:**
- Status code is 200
- Response has `products`, `total`, `skip`, `limit` properties
- `products` is an array

**Usage:**
```typescript
cy.request('GET', '/products').then((response) => {
  cy.validateProductResponse(response)
})
```

### `cy.validateSingleProduct(product)`
Validates the structure of a single product object.

**Parameters:**
- `product`: `Product` - A single product object with typed structure

**Validates:**
- Product has required fields: `id`, `title`, `description`, `price`, `category`, `brand`, `stock`, `rating`

**Usage:**
```typescript
const product = response.body.products[0]
cy.validateSingleProduct(product)
```

### `cy.validateProductsArray(products)`
Validates an array of products using `validateSingleProduct` for each product.

**Parameters:**
- `products`: `Product[]` - Array of product objects with typed structure

**Usage:**
```typescript
cy.validateProductsArray(response.body.products)
```

### `cy.checkResponseTime(response, maxTime)`
Validates that the API response time is within acceptable limits.

**Parameters:**
- `response`: `Cypress.Response<any>` - The API response object
- `maxTime`: `number` - Maximum allowed response time in milliseconds (default: 3000)

**Usage:**
```typescript
cy.checkResponseTime(response, 2000) // 2 seconds max
```

### `cy.validateProductDataTypes(product)`
Validates data types and constraints for a product object.

**Parameters:**
- `product`: `Product` - A single product object with typed structure

**Validates:**
- All required fields have correct data types
- Price is greater than 0
- Rating is between 0 and 5
- Stock is non-negative
- String fields have non-zero length

**Usage:**
```typescript
products.forEach(product => {
  cy.validateProductDataTypes(product)
})
```

### `cy.validatePagination(response, expectedLimit, expectedSkip)`
Validates pagination parameters in the response.

**Parameters:**
- `response`: `Cypress.Response<ProductsResponse>` - The API response object with typed body
- `expectedLimit`: `number` - Expected limit value
- `expectedSkip`: `number` - Expected skip value (default: 0)

**Validates:**
- `limit` matches expected value
- `skip` matches expected value
- Products array length matches limit

**Usage:**
```typescript
cy.validatePagination(response, 10, 5)
```

### `cy.validateFieldSelection(product, includedFields, excludedFields)`
Validates that a product has only the specified fields (for field selection testing).

**Parameters:**
- `product`: `Product` - A single product object with typed structure
- `includedFields`: `string[]` - Array of field names that should be present
- `excludedFields`: `string[]` - Array of field names that should NOT be present

**Usage:**
```typescript
cy.validateFieldSelection(
  product,
  ['id', 'title', 'price'],
  ['description', 'category', 'brand']
)
```

### `cy.validateSingleProductResponse(response)`
Validates the structure of a single product API response.

**Parameters:**
- `response`: `Cypress.Response<Product>` - The API response object with typed body

**Validates:**
- Status code is 200
- Response has all required product fields
- Product structure is complete

**Usage:**
```typescript
cy.request('GET', '/products/1').then((response) => {
  cy.validateSingleProductResponse(response)
})
```

### `cy.validateSearchResponse(response)`
Validates the structure of a search API response.

**Parameters:**
- `response`: `Cypress.Response<ProductsResponse>` - The API response object with typed body

**Validates:**
- Status code is 200
- Response has `products`, `total`, `skip`, `limit` properties
- `products` is an array

**Usage:**
```typescript
cy.request('GET', '/products/search?q=phone').then((response) => {
  cy.validateSearchResponse(response)
})
```

### `cy.validateProductMatchesSearch(products, searchQuery)`
Validates that products match the search query.

**Parameters:**
- `products`: `Product[]` - Array of product objects
- `searchQuery`: `string` - The search query to validate against

**Validates:**
- Each product's searchable text includes the query (case insensitive)

**Usage:**
```typescript
cy.validateProductMatchesSearch(response.body.products, 'phone')
```

### `cy.validateProductAgainstFixture(product, fixtureData)`
Validates a product against fixture data.

**Parameters:**
- `product`: `Product` - The product object from API response
- `fixtureData`: `Product` - The fixture data to compare against

**Validates:**
- Product matches fixture data exactly

**Usage:**
```typescript
cy.fixture('products/single-product').then((fixtureData) => {
  cy.validateProductAgainstFixture(response.body, fixtureData)
})
```

### `cy.validateBasicProductData(product, fixtureProduct)`
Validates basic product data against fixture data.

**Parameters:**
- `product`: `Product` - The product object from API response
- `fixtureProduct`: `Product` - The fixture product to compare against

**Validates:**
- Product ID, title, category, price, brand

**Usage:**
```typescript
cy.validateBasicProductData(responseProduct, fixtureProduct)
```

### `cy.validatePaginationAgainstFixture(response, fixtureData)`
Validates pagination parameters against fixture data.

**Parameters:**
- `response`: `Cypress.Response<ProductsResponse>` - The API response object
- `fixtureData`: `ProductsResponse` - The fixture data to compare against

**Validates:**
- `total`, `skip`, `limit` match fixture data exactly

**Usage:**
```typescript
cy.validatePaginationAgainstFixture(response, fixtureData)
```

## Type Safety

All custom commands are fully typed using TypeScript interfaces:

- **`Product`** - Complete product object structure
- **`ProductsResponse`** - API response structure for multiple products
- **`Cypress.Response<T>`** - Cypress response wrapper with typed body
- **`Review`** - Product review structure
- **`Category`** - Product category structure

This provides:
- ✅ **IntelliSense** - Auto-completion in your IDE
- ✅ **Compile-time validation** - Catch errors before runtime
- ✅ **Refactoring safety** - Changes to interfaces are caught automatically
- ✅ **Documentation** - Types serve as inline documentation
- ✅ **Fixture validation** - Real data validation against fixtures

## Best Practices

1. **Use custom commands for common validations** - This reduces code duplication and makes tests more maintainable.

2. **Combine custom commands with specific validations** - Use custom commands for general structure validation, then add specific business logic validations.

3. **Keep custom commands focused** - Each command should have a single responsibility.

4. **Document new commands** - When adding new custom commands, update this documentation.

5. **Use typed parameters** - Always use the specific types instead of `any` for better type safety.

## Example Test Structure

```typescript
describe('API Test Example', () => {
  it('should validate product response', () => {
    cy.request('GET', '/products').then((response) => {
      // Use custom commands for common validations
      cy.validateProductResponse(response)
      cy.checkResponseTime(response, 3000)
      
      // Add specific business logic validations
      expect(response.body.total).to.be.greaterThan(0)
      
      // Validate individual products
      response.body.products.forEach(product => {
        cy.validateProductDataTypes(product)
      })
    })
  })
})
``` 