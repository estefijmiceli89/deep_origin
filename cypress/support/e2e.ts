// Import commands.js using ES2015 syntax:
import './commands'
import { ProductsResponse, Product } from './types'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for API testing
declare global {
  namespace Cypress {
    interface Chainable {
      validateProductResponse(response: Cypress.Response<ProductsResponse>): void
      validateSingleProduct(product: Product): void
      validateProductsArray(products: Product[]): void
      checkResponseTime(response: Cypress.Response<any>, maxTime?: number): void
      validateProductDataTypes(product: Product): void
      validatePagination(response: Cypress.Response<ProductsResponse>, expectedLimit: number, expectedSkip?: number): void
      validateFieldSelection(product: Product, includedFields: string[], excludedFields: string[]): void
      validateSingleProductResponse(response: Cypress.Response<Product>): void
      validateSearchResponse(response: Cypress.Response<ProductsResponse>): void
      validateProductMatchesSearch(products: Product[], searchQuery: string): void
      validateProductAgainstFixture(product: Product, fixtureData: Product): void
      validateGroceryProductAgainstFixture(product: Product, fixtureData: Product): void
      validateBasicProductData(product: Product, fixtureProduct: Product): void
      validatePaginationAgainstFixture(response: Cypress.Response<ProductsResponse>, fixtureData: ProductsResponse): void
    }
  }
} 