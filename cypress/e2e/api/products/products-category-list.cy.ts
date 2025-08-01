import { Category } from '../../../support/types'
import { getProductUrls } from '../../../support/config'

describe('Products API - Category List Operations', () => {
  const urls = getProductUrls()

  describe('GET /products/category-list', () => {
    it('should return category list with correct structure', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          // Validate response structure
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an(testData.structureValidation.arrayType)
          expect(response.body.length).to.be.greaterThan(0)

          // Validate all items are strings
          response.body.forEach((category: string) => {
            expect(category).to.be.a(testData.structureValidation.dataType)
            expect(category.length).to.be.greaterThan(0)
          })
        })
      })
    })

    it('should validate all categories are unique', () => {
      cy.request('GET', urls.categoryList).then(response => {
        const categories = response.body
        const uniqueCategories = [...new Set(categories)]

        expect(uniqueCategories.length).to.eq(categories.length)
      })
    })

    it('should validate categories are in slug format', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body

          // Validate slug format using fixture data
          categories.forEach((category: string) => {
            expect(category).to.match(
              new RegExp(testData.validationRules.slugPattern)
            )
            expect(category).to.not.include(' ')
            expect(category).to.not.include('_')
          })
        })
      })
    })

    it('should validate specific known categories exist', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body

          // Validate expected categories from fixture
          testData.expectedCategories.forEach((expectedCategory: string) => {
            expect(categories).to.include(expectedCategory)
          })
        })
      })
    })

    it('should validate response time is reasonable', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          expect(response.duration).to.be.lessThan(
            testData.validationRules.responseTimeLimit
          )
        })
      })
    })

    it('should validate categories against detailed categories endpoint', () => {
      // Get category list
      cy.request('GET', urls.categoryList).then(categoryListResponse => {
        const categoryList = categoryListResponse.body

        // Get detailed categories
        cy.request('GET', urls.categories).then(detailedCategoriesResponse => {
          const detailedCategories = detailedCategoriesResponse.body

          // Validate both endpoints return the same number of categories
          expect(categoryList.length).to.eq(detailedCategories.length)

          // Validate all category list items exist in detailed categories
          categoryList.forEach((categorySlug: string) => {
            const matchingDetailedCategory = detailedCategories.find(
              (cat: Category) => cat.slug === categorySlug
            )
            expect(matchingDetailedCategory).to.exist
          })
        })
      })
    })

    it('should validate no empty or null categories', () => {
      cy.request('GET', urls.categoryList).then(response => {
        const categories = response.body

        categories.forEach((category: string) => {
          expect(category).to.not.be.empty
          expect(category).to.not.be.null
          expect(category).to.not.be.undefined
        })
      })
    })

    it('should validate categories contain only valid characters', () => {
      cy.fixture('test-data/products-category-list.json').then(testData => {
        cy.request('GET', urls.categoryList).then(response => {
          const categories = response.body

          categories.forEach((category: string) => {
            // Should only contain lowercase letters, numbers, and hyphens using fixture data
            expect(category).to.match(
              new RegExp(testData.validationRules.slugPattern)
            )
            // Should not start or end with hyphen
            expect(category).to.not.match(
              new RegExp(testData.validationRules.noLeadingTrailingHyphen)
            )
            // Should not have consecutive hyphens
            expect(category).to.not.include(
              testData.validationRules.noConsecutiveHyphens
            )
          })
        })
      })
    })
  })
})
