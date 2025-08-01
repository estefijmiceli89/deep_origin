import { Category, Product } from '../../../support/types'
import { getProductUrls } from '../../../support/config'

describe('Products API - Categories Operations', () => {
  const urls = getProductUrls()

  describe('GET /products/categories', () => {
    it('should return all product categories with correct structure', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          // Validate response status
          expect(response.status).to.eq(200)

          // Validate response body is an array
          expect(response.body).to.be.an('array')
          expect(response.body.length).to.be.greaterThan(0)

          // Validate each category has required fields
          response.body.forEach((category: Category) => {
            expect(category).to.have.property('slug')
            expect(category).to.have.property('name')
            expect(category).to.have.property('url')

            // Validate data types
            expect(category.slug).to.be.a('string')
            expect(category.name).to.be.a('string')
            expect(category.url).to.be.a('string')

            // Validate URL format using fixture data
            expect(category.url).to.include(testData.validationRules.urlPattern)
            expect(category.url).to.include(category.slug)
          })
        })
      })
    })

    it('should validate categories have unique slugs', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body
        const slugs = categories.map((cat: Category) => cat.slug)
        const uniqueSlugs = [...new Set(slugs)]

        // All slugs should be unique
        expect(slugs.length).to.eq(uniqueSlugs.length)
      })
    })

    it('should validate categories have unique names', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body
        const names = categories.map((cat: Category) => cat.name)
        const uniqueNames = [...new Set(names)]

        // All names should be unique
        expect(names.length).to.eq(uniqueNames.length)
      })
    })

    it('should validate specific known categories exist', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          const categories = response.body
          const slugs = categories.map((cat: Category) => cat.slug)
          const names = categories.map((cat: Category) => cat.name)

          // Check for expected categories from fixture
          Object.values(testData.expectedCategories).forEach(
            (expectedCategory: any) => {
              expect(slugs).to.include(expectedCategory.slug)
              expect(names).to.include(expectedCategory.name)
            }
          )
        })
      })
    })

    it('should validate category name and slug consistency', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body

        categories.forEach((category: Category) => {
          // Slug should contain only lowercase letters and hyphens
          expect(category.slug).to.match(/^[a-z-]+$/)
        })
      })
    })

    it('should validate category data integrity', () => {
      cy.request('GET', urls.categories).then(response => {
        const categories = response.body

        categories.forEach((category: any) => {
          // No empty values
          expect(category.slug).to.not.be.empty
          expect(category.name).to.not.be.empty
          expect(category.url).to.not.be.empty

          // No null values
          expect(category.slug).to.not.be.null
          expect(category.name).to.not.be.null
          expect(category.url).to.not.be.null

          // No undefined values
          expect(category.slug).to.not.be.undefined
          expect(category.name).to.not.be.undefined
          expect(category.url).to.not.be.undefined
        })
      })
    })

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-categories.json').then(testData => {
        cy.request('GET', urls.categories).then(response => {
          // Response should be fast using fixture data
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          )
        })
      })
    })

    it('should validate categories against product data', () => {
      // First get categories
      cy.request('GET', urls.categories).then(categoriesResponse => {
        const categories = categoriesResponse.body
        const categorySlugs = categories.map((cat: Category) => cat.slug)

        // Then get all products to verify categories match
        cy.request('GET', urls.getAll).then(productsResponse => {
          const products = productsResponse.body.products
          const productCategories = [
            ...new Set(products.map((p: Product) => p.category)),
          ]

          // All product categories should exist in categories list
          productCategories.forEach(productCategory => {
            expect(categorySlugs).to.include(productCategory)
          })
        })
      })
    })
  })
})
