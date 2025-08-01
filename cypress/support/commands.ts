// API Testing Helpers
import { ProductsResponse, Product } from './types'

// Custom command to validate product response structure
Cypress.Commands.add(
  'validateProductResponse',
  (response: Cypress.Response<ProductsResponse>) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('products')
    expect(response.body).to.have.property('total')
    expect(response.body).to.have.property('skip')
    expect(response.body).to.have.property('limit')
    expect(response.body.products).to.be.an('array')
  }
)

// Custom command to validate single product structure
Cypress.Commands.add('validateSingleProduct', (product: Product) => {
  expect(product).to.have.property('id')
  expect(product).to.have.property('title')
  expect(product).to.have.property('description')
  expect(product).to.have.property('price')
  expect(product).to.have.property('category')
  expect(product).to.have.property('brand')
  expect(product).to.have.property('stock')
  expect(product).to.have.property('rating')
})

// Custom command to validate product array
Cypress.Commands.add('validateProductsArray', (products: Product[]) => {
  expect(products).to.be.an('array')
  products.forEach(product => {
    cy.validateSingleProduct(product)
  })
})

// Custom command to check response time
Cypress.Commands.add(
  'checkResponseTime',
  (response: Cypress.Response<any>, maxTime: number = 3000) => {
    expect(response.duration).to.be.lessThan(maxTime)
  }
)

// Custom command to validate product data types and constraints
Cypress.Commands.add('validateProductDataTypes', (product: Product) => {
  // Validate data types
  expect(product.id).to.be.a('number')
  expect(product.title).to.be.a('string')
  expect(product.description).to.be.a('string')
  expect(product.price).to.be.a('number')
  expect(product.discountPercentage).to.be.a('number')
  expect(product.rating).to.be.a('number')
  expect(product.stock).to.be.a('number')
  expect(product.category).to.be.a('string')
  expect(product.thumbnail).to.be.a('string')
  expect(product.images).to.be.an('array')
  expect(product.tags).to.be.an('array')

  // Validate constraints
  expect(product.price).to.be.greaterThan(0)
  expect(product.discountPercentage).to.be.at.least(0)
  expect(product.rating).to.be.at.least(0)
  expect(product.rating).to.be.at.most(5)
  expect(product.stock).to.be.at.least(0)
  expect(product.id).to.be.greaterThan(0)

  // Validate string lengths
  expect(product.title.length).to.be.greaterThan(0)
  expect(product.description.length).to.be.greaterThan(0)
  expect(product.category.length).to.be.greaterThan(0)

  // Brand validation (optional for grocery products)
  if (product.category !== 'groceries') {
    expect(product.brand).to.be.a('string')
    expect(product.brand.length).to.be.greaterThan(0)
  }
})

// Custom command to validate pagination parameters
Cypress.Commands.add(
  'validatePagination',
  (
    response: Cypress.Response<ProductsResponse>,
    expectedLimit: number,
    expectedSkip: number = 0
  ) => {
    expect(response.body.limit).to.eq(expectedLimit)
    expect(response.body.skip).to.eq(expectedSkip)
    expect(response.body.products).to.have.length(expectedLimit)
  }
)

// Custom command to validate field selection
Cypress.Commands.add(
  'validateFieldSelection',
  (product: Product, includedFields: string[], excludedFields: string[]) => {
    includedFields.forEach(field => {
      expect(product).to.have.property(field)
    })

    excludedFields.forEach(field => {
      expect(product).to.not.have.property(field)
    })
  }
)

// Custom command to validate single product response
Cypress.Commands.add(
  'validateSingleProductResponse',
  (response: Cypress.Response<Product>) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('title')
    expect(response.body).to.have.property('description')
    expect(response.body).to.have.property('price')
    expect(response.body).to.have.property('category')
    expect(response.body).to.have.property('stock')
    expect(response.body).to.have.property('rating')
    expect(response.body).to.have.property('reviews')
    expect(response.body).to.have.property('meta')

    // Brand is optional (grocery products may not have brand)
    if (response.body.category !== 'groceries') {
      expect(response.body).to.have.property('brand')
    }
  }
)

// Custom command to validate search response
Cypress.Commands.add(
  'validateSearchResponse',
  (response: Cypress.Response<ProductsResponse>) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('products')
    expect(response.body).to.have.property('total')
    expect(response.body).to.have.property('skip')
    expect(response.body).to.have.property('limit')
    expect(response.body.products).to.be.an('array')
  }
)

// Custom command to validate product matches search query
Cypress.Commands.add(
  'validateProductMatchesSearch',
  (products: Product[], searchQuery: string) => {
    products.forEach(product => {
      const brandText = product.brand || ''
      const searchableText =
        `${product.title} ${product.description} ${product.category} ${brandText}`.toLowerCase()
      expect(searchableText).to.include(searchQuery.toLowerCase())
    })
  }
)

// Custom command to validate product details against fixture
Cypress.Commands.add(
  'validateProductAgainstFixture',
  (product: Product, fixtureData: Product) => {
    expect(product.id).to.eq(fixtureData.id)
    expect(product.title).to.eq(fixtureData.title)
    expect(product.description).to.eq(fixtureData.description)
    expect(product.price).to.eq(fixtureData.price)
    expect(product.category).to.eq(fixtureData.category)
    expect(product.stock).to.eq(fixtureData.stock)
    expect(product.rating).to.eq(fixtureData.rating)

    // Validate brand only if it exists in fixture
    if (fixtureData.brand !== null && fixtureData.brand !== undefined) {
      expect(product.brand).to.eq(fixtureData.brand)
    }
  }
)

// Custom command to validate grocery product against fixture (no brand required)
Cypress.Commands.add(
  'validateGroceryProductAgainstFixture',
  (product: Product, fixtureData: Product) => {
    expect(product.id).to.eq(fixtureData.id)
    expect(product.title).to.eq(fixtureData.title)
    expect(product.description).to.eq(fixtureData.description)
    expect(product.price).to.eq(fixtureData.price)
    expect(product.category).to.eq(fixtureData.category)
    expect(product.stock).to.eq(fixtureData.stock)
    expect(product.rating).to.eq(fixtureData.rating)

    // Grocery products may not have brand or have null brand
    if (product.category === 'groceries') {
      expect(product.brand).to.be.oneOf([null, undefined])
    }
  }
)

// Custom command to validate basic product data
Cypress.Commands.add(
  'validateBasicProductData',
  (product: Product, fixtureProduct: Product) => {
    expect(product.id).to.eq(fixtureProduct.id)
    expect(product.title).to.eq(fixtureProduct.title)
    expect(product.category).to.eq(fixtureProduct.category)
    expect(product.price).to.eq(fixtureProduct.price)
    expect(product.brand).to.eq(fixtureProduct.brand)
  }
)

// Custom command to validate pagination parameters against fixture data
Cypress.Commands.add(
  'validatePaginationAgainstFixture',
  (
    response: Cypress.Response<ProductsResponse>,
    fixtureData: ProductsResponse
  ) => {
    expect(response.body.total).to.eq(fixtureData.total)
    expect(response.body.skip).to.eq(fixtureData.skip)
    expect(response.body.limit).to.eq(fixtureData.limit)
  }
)
